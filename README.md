[![](docs/logo.png)](http://selfiewithstrangers.club)

## Directory Structure

- `docs/` - project documents (team overview, project overview, functional spec, etc...)
- `notes/` - team meeting notes
- `src/` - code
    - `src/website` - code for the website
    - `src/app` - code for the app
    - `src/api` - code for the api
- `playbooks/` - ansible roles for provisioning servers

# Design Specification

Our design specification is at `docs/dspec/dspec.pdf` and our presentation is at `presentation/Presentation - Design Specification.pdf`.

These documents provide an overview of our technical specifications. This includes our vision, a description of the behavior at a level sufficient for implementation, an architecture diagram, a description of components, necessary external libraries, operation details, and our database schema.

## Running the dev environment

1. Install ansible on your computer: [http://docs.ansible.com/intro_installation.html](http://docs.ansible.com/intro_installation.html)
1. Run `vagrant up`
1. Do some development:
    - The website should be accessible at `127.0.0.1:8080`
    - The app is accessible at `127.0.0.1:3000`
      - to restart: `sudo service app restart`
      - to view logs: `sudo tail -f /var/log/upstart/app.log`
    - The api is accessible at `127.0.0.1:1800`
      - to restart: `sudo service api restart`
      - to view logs: `sudo tail -f /var/log/upstart/api.log`
      - to run the migrations: `PYTHONPATH=lib env/bin/python manage.py db upgrade`
