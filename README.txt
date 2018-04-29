Pour obtenir le JSON de la grille:

	https://localhost:3000/crossword/generation/grid/Easy
	https://localhost:3000/crossword/generation/grid/Medium
	https://localhost:3000/crossword/generation/grid/Hard

Pour obtenir un mot de L'API:

	https://localhost:3000/crossword/lexicon/word/<word condition>

Pour obtenir une definition de l'API:

	https://localhost:3000/crossword/definition/<mot>

Installer deasync sur le server si n'est pas installe

	npm install --save deasync

Touche pour le jeu de course :

	CONDUIRE LA VOITURE : W A S D
	MODE JOUR ET NUIT: N
	CHANGEMENT DE CAMERA : C
	ZOOM IN : I
	ZOOM OUT : O 

Routes specifiques :

	Section admin : 
	localhost:4200/racing/admin

Incrémentation du nombre de fois qu'une piste a été joué :

	Seulement incrémenté lorsque tu finis ta course et que tu click sur le boutton NEXT sur la
	page des meilleurs temps de la course.

Pour effectuer les tests:
	Côté client:
		Éteindre le serveur et le client
	Côté serveur:
		Partir le serveur
