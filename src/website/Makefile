VERSION=$(shell cat VERSION)

all: upload

img/logo.png:
	cp ../../docs/logo.png img

selfiewithstrangers.club_$(VERSION)_amd64.deb: img/logo.png
	fpm -s dir -t deb --prefix /var/www/selfiewithstrangers.club/ -n selfiewithstrangers.club -v $(VERSION) .

upload: selfiewithstrangers.club_$(VERSION)_amd64.deb
	package_cloud push brucespang/packages/ubuntu/trusty selfiewithstrangers.club_$(VERSION)_amd64.deb
