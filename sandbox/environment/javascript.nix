{ pkgs ? import <nixpkgs> { }
, pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; }
}:

pkgs.dockerTools.buildImage {
  name = "javascript";
  created = "now";
  copyToRoot = pkgs.buildEnv {
    name = "image-root";
    paths = [
        pkgs.nodejs
        pkgsLinux.bashInteractive
        pkgsLinux.coreutils
        ./.
  ];
    pathsToLink = [ "/bin" "/code-runner" ];
  };

  diskSize = 8192;
  config = {
    Cmd = [ "node" "/code-runner/runner.js"];
  }
