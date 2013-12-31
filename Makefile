WWW = $(HOME)/www/popin

www:
	cp *.html *.css *.js $(WWW)/.

popin.tar.gz:
	git archive --format=tar.gz --prefix=popin/ -o popin.tar.gz HEAD
