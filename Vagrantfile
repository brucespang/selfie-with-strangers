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
        env: 'dev'
      }
    end
  end

  config.vm.define "app" do |app|
    app.vm.network "forwarded_port", guest: 80, host: 8081
    app.vm.network "private_network", ip: "192.168.50.2"


    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "playbooks/app.yml"
      ansible.extra_vars = {
        env: 'dev'
      }
    end
  end

end
