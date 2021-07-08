all:
	/home/mostafa/dev/cake/services/doc-engine/main.py make-all

clean:
	rm -r out

deploy:
	rsync --exclude '*__cache__*' --delete -r -z ./out/ root@51.178.220.30:/var/www/html/org-docs.cakerobotics.com
