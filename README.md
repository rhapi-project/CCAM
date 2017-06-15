# CCAM
Recherche dans la Classification Commune des Actes Médicaux

## Pour tester
Ouvrir l'archive et cliquer sur index.html.

En ligne : [CCAM](https://download.oremia.com/CCAM?texte=avulsion)

## Présentation rapide
**RHAPI** est une API RESTful qui s'inscrit totalement dans l'émergence actuelle d'applications Web *full Front-End*, écrites uniquement en JavaScript.

**RHAPI** fournit l'ensemble de l'architecture *Back-End* ainsi que les logiques *Métiers*, pour des applications à destination des professionels de santé dont il ne restera qu'à développer l'interface utilisateur.

[Zumatec](http://www.zumatec.com) propose ici un exemple utilisant les fonctionnalités CCAM de RHAPI.

Comme la plupart des API RESTful, RHAPI est explorable directement depuis un navigateur ou une application telle que `curl`.

Pour retrouver les mots clefs et les codes des actes associés à un terme médical comme *trijumeau*, on peut ainsi faire une simple requête `GET` sur le serveur de démonstration RHAPI qui retournera la réponse sous forme d'un objet *JSON*.
  - [https://demo.rhapi.net/demo01/CCAM?texte=trijumeau](https://demo.rhapi.net/demo01/CCAM?texte=trijumeau)
  - avec curl :
  
[La documentation complète RHAPI](https://demo.rhapi.net/apidoc01/)

