[![opencodetisan](https://circleci.com/gh/opencodetisan/opencodetisan.svg?style=shield)](https://circleci.com/gh/opencodetisan/opencodetisan)

# OpenCODETISAN

Hey Developers! 🚀
We welcome contributions from everyone. Before you contribute, please read the following guidelines.

## Prerequisites

Before you start contributing, ensure you have met the following prerequisites so that you may able to run and test on your local machine, you'll need to install:

1. [Postgres](https://www.postgresql.org/download/)
2. [Docker](https://docs.docker.com/engine/install/)
3. [Docker Compose V2](https://docs.docker.com/compose/install/)
4. Node.js v18.15 
5. Npm v9.5

## Installation

1. Make sure you have Postgres, Node.js v18.15, and Npm v9.5 installed locally.

2. For installing Node.js and Npm, you have two options. You can use a Node version management tool such as nvm by running ‘nvm use’ ([nvm installation instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)). 
Alternatively, you may install Node.js along with npm directly from the official website ([Node.js download page](https://nodejs.org/en/download/)).

### Commands:

Install Script (Choose one from below):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Troubleshooting:

- If using bash:
```bash
source ~/.bashrc 
```
- If using zsh: 
```zsh
source ~/.zshrc
```
- If using ksh:
```ksh
. ~/.profile
```

Verify nvm installation:

```bash
command -v nvm
```

Install NodeJs and npm, then set the installed NodeJs version as active:

```bash
nvm install node
nvm use node
```

3. (If using windows) You need to install the wsl. 

### Command:

```bash
wsl –install
```

4. For installing Postgres, you may use this link (https://www.postgresql.org/download/) and choose the appropriate package and installer for your operating system.

### Commands(Linux):

Create the file repository configuration:

```bash
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

Import the repository signing key:

```bash
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
```

Update package list:

```bash
sudo apt-get update
```

Install the latest version of Postgresql: 

```bash
sudo apt-get -y install postgresql 
```

5. In addition, you’ll need to install [Docker] (https://docs.docker.com/engine/install/) and [Docker Compose V2] (https://docs.docker.com/compose/install/). 
If you prefer, you can also install the Docker Desktop, where Docker Compose V2 is now integrated into all current Docker Desktop Versions. Find the Docker Desktop links below: 
(Mac Version https://docs.docker.com/desktop/install/mac-install/)
(Windows Version https://docs.docker.com/desktop/install/windows-install/)
(Linux Version https://docs.docker.com/desktop/install/linux-install/)

### Commands:

Uninstall all conflicting packages:

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

Add Docker’s official GPG key:
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Add the repository to Apt Source:

```bash 
echo \
 "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
 $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
 sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

Install Docker Engine:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Update the package index, and install the latest version of Docker Compose: 

```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

## Configuration

1. Configuring Postgres

After installing Postgres, you may have to update the default password and need to create new databases.

### Commands:

Log into database:

```sh
psql -U postgres
```

Add role:

```sh
create user your_name with password ‘your_password’;
```
**Ex: create user myName with password ‘myPass’;**

Alter role:

```sh
Alter user your_name superuser;
```
**That “superuser” you may change it with some specific permission
**Refer to the link for more details (https://www.postgresql.org/docs/8.0/sql-createuser.html)** 

Exit the database:

```sh
\q
```

Create new database named “opencodetisan” or your preferred name:

```sh
createdb opencodetisan
```

**Verify database creation**:
Log into database:

```sh
psql -d opencodetisan
```

Check status:

```sh
\conninfo 
```
**Should show the info of your databases, if not repeat the step from "Create new databased..."**

Exit the database:

```sh
\q
```

2. Fork this repository
Click on the fork button on the top right of this page.
This will create a copy of this repository to your account.

3. Clone the repository to your local machine.

### Command:

```sh
git clone https://github.com/your-username/your-project.git
```

4. Install dependencies 

### Command:
```sh
npm install
```
5. Creating .env file
Create a .env file at the root of your OpenCODETISAN project.
Then copy the variables from .env.sample and paste it on your newly created .env file.

6. Defining DATABASE_URL in .env file* based on your database details. 
For example: DATABASE_URL=postgresql://postgres:password@localhost:5432/opencodetisan
Click [here](https://www.prisma.io/docs/orm/overview/databases/postgresql) for more information.

7. Create and apply database migrations

### Commands:

```sh
cd src
```

```sh
npx prisma migrate dev”
```

8. Seed the database to add sample data for future login and development

### Command:

```sh
npx prisma db seed
```

9. Run command 
```sh
npm run dev
``` 
and enter the SMTP setting in the Settings page, once you have done all the configuration above. 

10. For the Windows version, you may go to the “package.json” file and change the line "test:integration": "./scripts/run-integration-test.sh" into "test:integration": ".\\scripts\\run-integration-test.sh" so that the integration test would run in windows powershell. 

## Contributing

After making the modification, run the following commands to ensure there are no bugs or errors in the codes:

### Commands:

Unit Test:

```sh
npm run test:unit
```

Integration Test:

```sh
npm run test:integration
```
  
Once all the tests pass, commit the changes to the forked repository. Then, click the “Contribute” button and open a “pull request” to our repository.  

## Running the Local Development Server

To start the local development server, use the following command “npm run dev”.

You may also run the commands “cd src” and “npx prisma studio” to have a visual editor for your data within the databases. For more information about prisma studio, refer to this link: (https://www.prisma.io/docs/orm/tools/prisma-studio). 

## Usage

Use the following account to login to the software. 

Admin Account 1:
- Email: admin1@ocadmin.com
- Password: adminpass

Admin Account 2:
- Email: admin2@ocadmin.com
- Password: adminpass2


## Building the project

```sh
npm run build
```








