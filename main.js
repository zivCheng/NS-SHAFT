// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');


var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#71c5cf';
        game.load.spritesheet('player', 'assets/player.png', 32, 48);
        game.load.image('pipe', 'assets/stand-block.png');  
    },

    create: function() {         
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.score = 0;  
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        // Display the items on the screen
        this.player = this.game.add.sprite(32, game.world.height - 150, 'player');
        this.pipes = this.game.add.group(); // Create a group  
       
        
     
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 800;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        
        this.pipes.enableBody = true;  // Add physics to the group  
        this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes  
        
        
        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);   
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
       
    },

    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.player.inWorld == false)
            this.restartGame();
         game.physics.arcade.collide(this.player, this.pipes);
        //game.physics.arcade.overlap(this.user, this.pipes, this.restartGame, null, this);  
    },
    jump: function() {
        this.player.body.velocity.y = -350;
    },
    restartGame: function() {
        game.state.start('main');
    },
    addOnePipe: function(x, y) {  
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();
        
       pipe.body.immovable = true;        
        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {  
        // Pick where the hole will be
        var hole = Math.floor(Math.random() * 5) + 1;

        this.score += 1;  
        this.labelScore.text = this.score;  
        
        // Add the 6 pipes 
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
    },
};

game.state.add('main', mainState);  
game.state.start('main');  