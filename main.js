// Initialize Phaser, and create a 400x490px game
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var numberOfBlockTypes = 3;
var game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'gameDiv');
var keyId = 0;

var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#71c5cf';
        game.load.spritesheet('player', 'assets/player.png', 32, 48);
        game.load.image('stand', 'assets/stand-block.png');
        game.load.image('jump', 'assets/jump-block.png');
        game.load.image('danger', 'assets/danger-block.png');  
    },

    create: function() {         
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.score = 0;  
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        this.lives = 10;  
        this.livesScore = game.add.text(60, 20, "10", { font: "30px Arial", fill: "#ffffff" });
        this.cursors = game.input.keyboard.createCursorKeys();
        
        // Display the items on the screen
        this.player = this.game.add.sprite(32, 0, 'player');
        this.standBlocks = this.game.add.group(); // Create a group  
        this.jumpBlocks = this.game.add.group(); // Create a group  
        this.dangerBlocks = this.game.add.group();
     
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 1000;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);        
        
        this.standBlocks.enableBody = true;
        this.standBlocks.createMultiple(100, 'stand');
        this.jumpBlocks.enableBody = true;
        this.jumpBlocks.createMultiple(100, 'jump');
        this.dangerBlocks.enableBody = true;
        this.dangerBlocks.createMultiple(100, 'danger');
        
        this.timer = game.time.events.loop((1500-this.score), this.addRowOfBlocks, this); 
       
    },

    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        this.player.body.velocity.x = 0;
        
        if (this.player.inWorld == false)
            this.restartGame();
        game.physics.arcade.collide(this.player, this.standBlocks, this.increaseLive, null, this);
        game.physics.arcade.collide(this.player, this.jumpBlocks, this.increaseLive, null, this);
        game.physics.arcade.collide(this.player, this.dangerBlocks, this.decreaseLive, null, this);
        if (this.cursors.left.isDown)
        {
           this.moveLeft();
        }
        else if (this.cursors.right.isDown)
        {
            this.moveRight();
        }
         else
        {       
            this.player.animations.stop();
            this.player.frame = 4;
        }
    },
    restartGame: function() {
        game.state.start('main');
    },
    moveLeft:function() {
        this.player.body.velocity.x = -150;
        this.player.animations.play('left');
    },
    moveRight: function() {
        this.player.body.velocity.x = 150;
        this.player.animations.play('right');
    },
    jump: function() {
         this.player.body.velocity.y = -450;
    },
    increaseLive: function(Sprite, Group){
       if(!Group._hasStand){
           if(Group._type == 0)
                Group._hasStand = true;   
           else
               this.jump();
           
            if(this.lives<10){
                this.lives++;
                this.livesScore.text = this.lives;  
            }
       }
    },
    decreaseLive: function(Sprite, Group){
       if(!Group._hasStand){
            Group._hasStand = true;
            this.lives--;
            this.livesScore.text = this.lives;  
            if(this.lives<=0){
                this.restartGame();
            }
       }
    },
    addOneBlock: function(i, x, y) {  
        // Get the first dead pipe of our group
        var block;
        if(i==0)
        {
            block = this.standBlocks.getFirstDead();  
            block._type = 0;
        }
        else if(i== 1)
        {
            block = this.jumpBlocks.getFirstDead(); 
            block._type = 1;
        }
        else if(i== 2)
        {
            block = this.dangerBlocks.getFirstDead();
            block._type = 2;
        }
        block._hasStand = false;
        block.reset(x, y);
        block.body.velocity.y = -100 - (this.score); 
        block.body.immovable = true; 
        block.checkWorldBounds = true;
        block.outOfBoundsKill = true;
    },
    addRowOfBlocks: function() {  
        // Pick where the hole will be
        var xPos = Math.random() * (screenWidth - 150);
        var type = Math.round(Math.random()*(numberOfBlockTypes-1))
        
        this.score += 1;  
        this.labelScore.text = this.score;  
        
        this.addOneBlock(type, xPos, screenHeight);   
    },
};

game.state.add('main', mainState);  
game.state.start('main');  