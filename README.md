# ChargeController_Simple
Charge your EV

Questo progetto è inizialmente nato da mia automazione domotica fatta con NodeRED.
Il progetto è cresciuto e ho iniziato a scrivere il codice direttamente in Javascript, solo che ad un certo punto iniziava ad essere scomodo a programmare in un browser.
Adesso il mio obiettivo è portare tutto il mio codice in NodeJS e renderlo indipendente dal resto.

Sostanzialmente l'applicazione si divide in due parti:
* Webserver
  Ci sarà una parte di configurazione di alcuni valori (capacità batterie, soglie di allarme ecc)
  Una parte di visualizzazione dei valori di processo
* Controller
  Il cuore dell'applicazione che gestisce il tutto
