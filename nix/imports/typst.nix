{ inputs, ... }:
{
  imports = [ inputs.make-shell.flakeModules.default ];

  perSystem =
    {
      pkgs,
      lib,
      ...
    }:
    let
      typst = pkgs.typst.withPackages (
        p: with p; [
          charged-ieee_0_1_3
          algorithmic_0_1_0
        ]
      );

      typst-fonts = pkgs.symlinkJoin {
        name = "typst-fonts";
        paths = with pkgs; [
          inriafonts
          fg-virgil
          liberation_ttf
          nerd-fonts.inconsolata
          newcomputermodern
          gyre-fonts
        ];
      };

      mkTypstScript =
        action: documentName:
        pkgs.writeShellApplication {
          name = "typst-${action}-${documentName}";

          runtimeInputs = [ typst ];

          text = ''
            ${lib.getExe typst} \
              ${action} \
              --root ./. \
              --input rev="${inputs.self.rev or ""}" \
              --input shortRev="${inputs.self.shortRev or ""}" \
              --input builddate="$(date -u -d @${toString (inputs.self.lastModified or "")})" \
              --font-path ${typst-fonts} \
              --ignore-system-fonts \
              ./doc-typst/${documentName}/main.typ \
              ${documentName}.pdf
          '';
        };

      mkBuildDocumentDrv =
        action: documentName:
        pkgs.stdenvNoCC.mkDerivation {
          pname = "typst-${action}-${documentName}";
          version = typst.version;

          src = pkgs.lib.cleanSource ./.;

          buildInputs = [ typst ];

          buildPhase = ''
            runHook preBuild

            ${lib.getExe (mkTypstScript "compile" documentName)}

            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall

            install -m640 -D ${documentName}.* -t $out

            runHook postInstall
          '';
        };

      documentDrvs = lib.genAttrs (lib.attrNames (
        lib.filterAttrs (k: v: (v == "directory")) (builtins.readDir ../../doc-typst)
      )) (d: (mkBuildDocumentDrv "compile" d));

      scriptDrvs = lib.foldl' (
        a: i:
        a
        // {
          "compile-${i}" = (mkTypstScript "compile" i);
          "watch-${i}" = (mkTypstScript "watch" i);
        }
      ) { } (lib.attrNames documentDrvs);
    in
    {
      packages = documentDrvs;

      make-shells.default = {
        packages = lib.attrValues scriptDrvs;
      };
    };
}
