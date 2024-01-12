//déclaration des variables global
let CANVAS;
let COOR_X_RAQ = 0;
let SCORE = 0;
let LES_BALLES = [];

//création de ma classe Balle
class Balle{
    constructor(coordX, coordY, vitX, vitY) 
    {
        this.coordX = coordX;
        this.coordY = coordY
        this.vitX = vitX;
        this.vitY = vitY;
    }

    //permet de déterminer la position futur de la balle
    update()
    {
        this.coordX = this.coordX + this.vitX;
        this.coordY = this.coordY + this.vitY;
    }

    //permet d'afficher la balle
    display(){
        ellipse(this.coordX, this.coordY, 50, 50);
    }

    //permet de déterminer si la balle a touché la raquet et si la partie doit continuer
    //entré coordonné de la raquette et le score
    //sortie [la partie doit continué, une nouvelle balle doit être créé, le score mis à jour]
    rebondRaq(coorRaq, leScore){
        //La balle a t-elle rebondit sur la raquette ?
        if((this.coordX <= coorRaq +40 && this.coordX >= coorRaq-40 ) && (this.coordY >= height-60 && this.coordY <= height-40)) {
            this.vitY = this.vitY * -1;
            this.coordY = height-60
            leScore++;

            //une nouvelle balle doit-elle être créé ? 
            if (leScore % 5 == 0) {
                return [true, true, leScore];
            }
        }

        //la balle est-elle au dessus de la raquette ?
        if (this.coordY > height) {
            return [false, false, leScore];
        }

        //la partie continue
        return [true, false, leScore];
    }

    //permet de déterminer si la balle a touché un mur ou le plafond 
    rebondMur(){
        if ((this.coordX >= width-25) || (this.coordX <= 0+25) ) {
            this.vitX = this.vitX * -1;
        }
        if (this.coordY <= 0+25) {
            this.vitY = this.vitY * -1;
        }
    }

    //permet d'arréter la balle si on appuis sur la souris
    stopballePower(coorRaq)
    {
        if(this.coordY >= height-100 && this.coordY <= height-60 && this.coordX <= coorRaq +40 && this.coordX >= coorRaq-40)
        {
            if (mouseIsPressed) {
                this.vitX = 0;
                this.vitY = 0;
                this.coordX = coorRaq;
            }
            if(this.vitX == 0 && this.vitY == 0 && !mouseIsPressed)
            {
                this.vitX = Math.floor(Math.random() * -10);
                this.vitY = Math.floor(Math.random() * -10);
            }
        }        
    }
};

//permet de générer des coordonnées et une vitesse aléatoire 
function randomCoordSpeed() {
    let coordX = Math.floor(Math.random() * (width-100)) + 50;
    let coordY = Math.floor(Math.random() * (height / 2)) + 50;
    let vitX = Math.floor(Math.random() * 20) -10;
    let vitY = Math.floor(Math.random() * 20) -10;
    if (vitY == 0) {
        vitY = 1;
    }
    return[coordX, coordY, vitX, vitY];
}

//permet d'ajouter une balle dans le tableau
function ajoutBalle(lesBalles, attribu) {
    let coordX = attribu[0];
    let coordY = attribu[1];
    let vitX = attribu[2];
    let vitY = attribu[3];
    
    lesBalles.push(new Balle(coordX, coordY, vitX, vitY));
    return lesBalles;
}

function setup() 
{
    let x=3*windowWidth/5;
    let y = windowHeight*0.83;
    CANVAS = createCanvas(x, y);
    CANVAS.parent('centerPage');
    background(150);

    //défini la hauteur de la raquette
    COOR_X_RAQ = width/2 - 40;
    
    //ajout de la première balle
    ajoutBalle(LES_BALLES, randomCoordSpeed());
}

function draw()
{
    //met à jour le fond
    background(150);

    //génère la raquette à la position de la souris
    COOR_X_RAQ=mouseX;
    rect(COOR_X_RAQ - 40, height - 40, 80, 20);
    
    //test pour chaque balle du tableau 
    for (let index = 0; index < LES_BALLES.length; index++) {
        balleResult = LES_BALLES[index].rebondRaq(COOR_X_RAQ, SCORE);
        // met à jour le score global
        SCORE = balleResult[2];

        //arrete la partir si elle est perdu
        if (!balleResult[0]) {
            background(0,0,0);
            textSize(40);
            fill('red');
            text('Perdu', width/3, height/2);
            SCORE = "votre score est : " + SCORE;
            fill('white');
            text(SCORE, width/3, height/2 +30 );

            //arrete la fonction draw
            noLoop();
        }
        //créais une balle en plus 
        if(balleResult[1]){
            ajoutBalle(LES_BALLES, randomCoordSpeed());
        }

        LES_BALLES[index].rebondMur();
        LES_BALLES[index].stopballePower(COOR_X_RAQ);
        LES_BALLES[index].update();
        LES_BALLES[index].display();
    }
}

function windowResized() 
{
    let x=3*windowWidth/5
    y = windowHeight*0.84-12;
    resizeCanvas(x,y);
}

function restart() {
    //vide le tableau
    LES_BALLES = [];

    // ajoute une balle
    ajoutBalle(LES_BALLES, randomCoordSpeed());

    //réinisialise le score
    SCORE = 0;

    //relance la fonction draw
    loop();
}