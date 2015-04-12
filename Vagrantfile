# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  config.ssh.forward_agent = true

  config.vm.define "web" do |web|
    web.vm.network "forwarded_port", guest: 80, host: 8080
    web.vm.network "private_network", ip: "192.168.50.2"


    web.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/web.yml"
      ansible.extra_vars = {
        ansible_env: 'dev'
      }
    end
  end

  config.vm.define "app" do |app|
    app.vm.network "forwarded_port", guest: 80, host: 3000
    app.vm.network "private_network", ip: "192.168.50.3"

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/app.yml"
      ansible.extra_vars = {
        ansible_env: 'dev'
      }
    end
  end

  config.vm.define "api" do |app|
    app.vm.network "forwarded_port", guest: 5000, host: 5000
    app.vm.network "private_network", ip: "192.168.50.4"

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/api.yml"
      ansible.extra_vars = {
        ansible_env: 'dev'
      }
    end
  end

  config.vm.define "db" do |app|
    app.vm.network "private_network", ip: "192.168.50.5"

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/db.yml"
      ansible.extra_vars = {
        ansible_env: 'dev'
      }
    end
  end

end
