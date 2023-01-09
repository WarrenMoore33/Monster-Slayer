function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: [],
            damageValue: null,
            monsterDamage: null,
            healedValue: null,
            showPoints: false
        };
    },
    methods: {
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.logMessages = [];
            this.damageValue = null;
            this.monsterDamage = null;
            this.healedValue = null;
        },
        playWinner() {
            const monsterSound = new Audio('sounds/monster2.wav');
            const playerSound = new Audio('sounds/entertain.wav');
            playerSound.currentTime=0;
            monsterSound.currentTime=0;
            this.playerHealth > this.monsterHealth ? playerSound.play() : monsterSound.play();
        },
        pointFlash() {
            this.showPoints = true
            setTimeout(() => {
                this.showPoints = false;
                this.damageValue = null;
                this.monsterDamage = null;
                this.healedValue = null;
              }, "1800")
        },
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(5, 12)
            this.monsterHealth -= attackValue;
            this.monsterDamage = attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
            this.pointFlash();
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15)
            this.playerHealth -= attackValue;
            this.damageValue = attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(10, 25)
            this.monsterHealth -= attackValue;
            this.monsterDamage = attackValue;
            this.addLogMessage('player', 'SPECIAL ATTACK', attackValue);
            this.attackPlayer();
            this.pointFlash();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(8, 20)
            this.attackPlayer();
            if(this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
                this.addLogMessage('player', 'heal', 100);
            } else {
                this.playerHealth += healValue;
                this.healedValue = healValue;
                this.addLogMessage('player', 'heal', healValue);
            }
            this.pointFlash();
        }, 
        surrender() {
            this.winner = 'monster';
            this.playerHealth = 0;
            this.playWinner();
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who, 
                actionType: what, 
                actionValue: value
            })
        }
    },
    computed: {
        monsterBarStyles() {
            if(this.monsterHealth < 0) {
                this.monsterHealth = 0;
                return {width: '0%'}
            }
            return {width: this.monsterHealth + '%'}
        },
        playerBarStyles() {
            if(this.playerHealth < 0) {
                this.playerHealth = 0;
                return {width: '0%'}
            }
            return {width: this.playerHealth + '%'}
        },
        specialAvailable() {
            return this.currentRound % 3 === 0 ? true : false
        }
    },
    watch: {
        playerHealth(value) {
            if(value <= 0 && this.monsterHealth <= 0) {
                // A draw
                this.winner = 'draw'
            } else if(value <= 0) {
                // You lose
                this.winner = 'monster';
                this.playWinner();
            }
        },
        monsterHealth(value) {
            if(value <= 0 && this.playerHealth <= 0) {
                // A draw
                this.winner = 'draw'
            } else if(value <= 0) {
                // You win
                this.winner = 'player';
                this.playWinner();
            }
        },

    }
}).mount('#game')