[![](docs/logo.png)](http://selfiewithstrangers.club)

## Directory Structure

- `docs/` - project documents (team overview, project overview, functional spec, etc...)
- `notes/` - team meeting notes
- `src/` - code
    - `src/website` - code for the website
    - `src/app` - code for the app
- `playbooks/` - ansible roles for provisioning servers

# Design Specification

Our recently created design specification is located in /docs/dspec/dspec.pdf and our recently created
presentation is located in /presentation/Presentation - Design Specification.pdf. These documents provide
an overview of our technical specifications. This includes our vision, api and a workflow of our behavior
, necessary external libraries, components, operation details, and our database schema.  

## Running the dev environment

1. Run `vagrant up`
1. Do some development:
    - The website should be accessible at `127.0.0.1:8080`
    - The app should be accessible at `127.0.0.1:8081`
