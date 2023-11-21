#!/usr/bin/env bash

is_mac() {
    [[ $OSTYPE == darwin* ]]
}

check_os() {
    if is_mac; then
        package_manager="brew"
        desired_os=1
        os="mac"
        return
    fi

    local os_name="$(
        cat /etc/*-release \
            | awk -F= '$1 == "NAME" { gsub(/"/, ""); print $2; exit }' \
            | tr '[:upper:]' '[:lower:]'
    )"

    case "$os_name" in
        ubuntu*)
            desired_os=1
            os="ubuntu"
            package_manager="apt-get"
            ;;
        debian*)
            desired_os=1
            os="debian"
            package_manager="apt-get"
            ;;
        linux\ mint*)
            desired_os=1
            os="linux mint"
            package_manager="apt-get"
            ;;
        red\ hat*)
            desired_os=1
            os="rhel"
            package_manager="yum"
            ;;
        centos*)
            desired_os=1
            os="centos"
            package_manager="yum"
            ;;
        sles*)
            desired_os=1
            os="sles"
            package_manager="zypper"
            ;;
        opensuse*)
            desired_os=1
            os="opensuse"
            package_manager="zypper"
            ;;
        *)
            desired_os=0
            os="Not Found: $os_name"
    esac
}

if [ -x "$(command -v docker)" ]; then
    echo "Update docker"
    # command
else
    echo "Install docker"
    # # Add Docker's official GPG key:
    # apt_cmd="sudo apt-get --yes --quiet"
    # $apt_cmd update
    # $apt_cmd install ca-certificates curl gnupg
    # sudo install -m 0755 -d /etc/apt/keyrings
    # curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    # sudo chmod a+r /etc/apt/keyrings/docker.gpg
    # 
    # # Add the repository to Apt sources:
    # echo \
    #   "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    #   "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    #   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    # $apt_cmd update
    #
    # # Install the Docker packages:
    # $apt_cmd install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

if [ -x "$(command -v docker compose)" ]; then
    echo "Update docker"
    docker compose version
else
    echo "Install docker compose"
fi


# install_docker() {
#     echo "++++++++++++++++++++++++"
#     echo "Setting up docker repos"
#
#     if [[ $package_manager == apt-get ]]; then
#         apt_cmd="apt-get --yes --quiet"
#         $apt_cmd update
#         $apt_cmd install software-properties-common gnupg-agent
#         curl -fsSL "https://download.docker.com/linux/$os/gpg" | apt-key add -
#         add-apt-repository \
#             "deb [arch=amd64] https://download.docker.com/linux/$os $(lsb_release -cs) stable"
#         $apt_cmd update
#         echo "Installing docker"
#         $apt_cmd install docker-ce docker-ce-cli containerd.io
#
#     elif [[ $package_manager == zypper ]]; then
#         zypper_cmd="zypper --quiet --no-gpg-checks --non-interactive"
#         echo "Installing docker"
#         if [[ $os == sles ]]; then
#             os_sp="$(cat /etc/*-release | awk -F= '$1 == "VERSION_ID" { gsub(/"/, ""); print $2; exit }')"
#             os_arch="$(uname -i)"
#             SUSEConnect -p "sle-module-containers/$os_sp/$os_arch" -r ''
#         fi
#         $zypper_cmd install docker docker-runc containerd
#         systemctl enable docker.service
#
#     else
#         yum_cmd="yum --assumeyes --quiet"
#         $yum_cmd install yum-utils
#         os_in_repo_link="$os"
#         if [[ $os == rhel ]]; then
#             # For RHEL, there's no separate repo link. We can use the CentOS one though.
#             os_in_repo_link=centos
#         fi
#         yum-config-manager --add-repo "https://download.docker.com/linux/$os_in_repo_link/docker-ce.repo"
#         echo "Installing docker"
#         $yum_cmd install docker-ce docker-ce-cli containerd.io
#
#     fi
#
# }
