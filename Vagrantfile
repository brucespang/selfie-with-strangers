# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  config.ssh.forward_agent = true

  hosts = {
    app: "192.168.50.3",
    api: "192.168.50.4",
    db: "192.168.50.5"
  }

  config.vm.define "app" do |app|
    app.vm.network "forwarded_port", guest: 80, host: 3000
    app.vm.network "private_network", ip: hosts[:app]

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/app.yml"
      ansible.extra_vars = {
        ansible_ssh_user: "vagrant",
        ansible_env: 'dev',
        hosts: hosts
      }
    end
  end

  config.vm.define "db" do |app|
    app.vm.network "private_network", ip: hosts[:db]

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/db.yml"
      ansible.extra_vars = {
        ansible_ssh_user: "vagrant",
        ansible_env: 'dev',
        hosts: hosts
      }
    end
  end

  config.vm.define "api" do |app|
    app.vm.network "forwarded_port", guest: 80, host: 1800
    app.vm.network "private_network", ip: hosts[:api]

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/api.yml"
      ansible.extra_vars = {
        ansible_ssh_user: "vagrant",
        ansible_env: 'dev',
        hosts: hosts
      }
    end
  end

end
