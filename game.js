function update() {

    if (misses == 10) {
        gameover = true;
    }

    if (gameover) {
        if (lostSoundPlayed != true) {
            lostSound.play();
            lostSoundPlayed = true;
            music.pause();
        }
        showDialog(score);
        return;
    }

    santa.dir.x = 0;
    santa.dir.y = 0;

    var speedModifier = framerate / 33.333;

    for (var i = 0, max = backgrounds.length; i < max ; i++) {        
        var background = backgrounds[i];
        background.pos.x += background.speed * santa.speedModifier * speedModifier;
    }
    
    if (keyboard.RIGHT == 1) {
        santa.dir.x = 1;
    }
    if (keyboard.DOWN == 1) {
        santa.dir.y = 1;
    }
    if (keyboard.LEFT == 1) {
        santa.dir.x = -1;
    }
    if (keyboard.UP == 1) {
        santa.dir.y = -1;
    }

    var unitDir = getUnitVector(santa.dir.x, santa.dir.y);

    santa.pos.x += santa.speed * unitDir.x * speedModifier;
    santa.pos.y += santa.speed * unitDir.y * speedModifier;

    if (santa.pos.y > height - santa.size.y ) {
        santa.pos.y = height - santa.size.y;
    }
    if (santa.pos.y < 0) {
        santa.pos.y = 0;
    }
    if (santa.pos.x < 0) {
        santa.pos.x = 0;
    }
    if (santa.pos.x > width - santa.size.x) {
        santa.pos.x = width - santa.size.x;
    }

    if (keyboard.SPACE == 1) {
        if (santa.lastPresent > santa.presentCDMs) {
            dropPresent(santa.pos.x + 10, santa.pos.y + 40);
            santa.lastPresent = 0;
        }
    }
    
    if (santa.lastPresent < santa.presentCDMs) {
        santa.lastPresent += framerate;
    }
    
    for (var i = 0, max = presents.length; i < max; i++) {        
        var p = presents[i];
        p.pos.y += 30 * speedModifier * p.dir.x;
        p.pos.x += 30 * speedModifier * p.dir.y;
        if (p.pos.y > height) {
            presents.splice(i, 1);
            i--;
            max--;           
        }
    }

    for (var i = 0, max = buffs.length; i < max; i++) {
        var b = buffs[i];
        b.pos.x += 12 * santa.speedModifier * speedModifier;
        if (b.pos.x > width) {
            buffs.splice(i, 1);
            i--;
            max--;
        }
        if (intersects(b.pos, 15, santa.pos, 40)) {
            buffs.splice(i, 1);
            i--;
            max--;
            santa.speedModifier += 0.5;
            speedSound.play();
        }
    }

    if (speedBuffTime <= 0 && Math.random() < 0.5) {
        spawnBuff();
        speedBuffTime = speedBuffMaxTime - spawnRate;
    }

    if (houseMachine.lastDistance >= houseMachine.minDistance) {
        var modifier = houseMachine.maxDistance / (houseMachine.lastDistance - houseMachine.minDistance);
        if (Math.random() < modifier) {
            spawnHouse();
            houseMachine.lastDistance = 0;
        }
    }
    houseMachine.lastDistance += 12 * santa.speedModifier * speedModifier;

    for (var i = 0, max = houses.length; i < max; i++) {
        var h = houses[i];
        h.pos.x += 12 * santa.speedModifier * speedModifier;
        if (h.hit != true) {
            for (var j = 0, jmax = presents.length; j < jmax; j++) {
                var p = presents[j];
                if (intersects(h.pos, 50, p.pos, 15)) {
                    h.hit = true;
                    score += santa.speedModifier;
                    presents.splice(j, 1);
                    j--;
                    jmax--;
                    presentHitSound.play();
                }
            }
        }
        if (h.pos.x > width) {
            houses.splice(i, 1);
            i--;
            max--;
            if (h.hit != true) {
                misses++;
            }
        }
        if (intersects(santa.pos, 40, h.pos, 50)) {
            gameover = true;
            stampSound.play();
        }
    }

    speedBuffTime -= framerate;
    arrow.updateDegree(speedModifier);
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // BACKGROUND    
    drawBackgrounds();
    
    ctx.fillStyle = ground.color;
    ctx.fillRect(0, height - ground.height, width, ground.height);

    // OBJECTS
    // santa
    ctx.drawImage(santa.image, santa.pos.x, santa.pos.y);
    // arrow
    ctx.translate(santa.pos.x + 20, santa.pos.y + 35);
    ctx.rotate(arrow.degree * Math.PI / 180);
    ctx.drawImage(arrow.image, -7.5, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // other
    drawObjectGroup(presents);
    drawObjectGroup(buffs);
    drawObjectGroup(houses);

    // score
    ctx.fillStyle = "green";
    ctx.font = "25px Arial";
    ctx.fillText("Pisteet: " + score, 10, 25);
    ctx.fillText("Taloja ohitettu: " + misses + "/10", 10, 50);

    if (gameover) {
        ctx.fillStyle = "pink";
        
        ctx.fillText("HÄVISIT PELIN.", width / 2 - ctx.measureText("HÄVISIT PELIN.").width / 2, 175);
        return;
    }

    setTimeout(draw, framerate);
}

function drawBackgrounds() {
    for (var i = 0, max = backgrounds.length; i < max; i++) {
        var background = backgrounds[i];
        var x1 = background.pos.x, x2 = background.pos.x - 1600;
        ctx.drawImage(background.image, x1, background.pos.y);
        ctx.drawImage(background.image, x2, background.pos.y);
        if (x1 > 800) {
            background.pos.x = -800;
        }
    }
}

function dropPresent(x, y) {
    throwSound.play();
    var tempDegrees = arrow.degree + 90;
    var dirx = Math.sin(tempDegrees * Math.PI / 180);
    var diry = Math.cos(tempDegrees * Math.PI / 180);

    var unit = getUnitVector(dirx, diry);

    var p = {
        image: presentImage,
        pos: { x: x, y: y },
        dir: { x: dirx, y: diry}
    };
    presents.push(p);
}

function spawnBuff() {
    var y = 0;
    if (Math.random() < 0.5) {
        y = Math.random() * (height - 20);
    }
    else {
        y = santa.pos.y + 20;
    }
    buffs.push({
        image: speedBuffImage,
        pos: { x: -40, y : y  }
    })
}

function spawnHouse() {
    var y = height - 50;
    houses.push({
        image: houseImage,
        pos: { x: -40, y: y },
        ishit : false
    });
}

function drawObjectGroup(group) {
    for (var i = 0, max = group.length; i < max; i++) {
        var p = group[i];
        ctx.drawImage(p.image, p.pos.x, p.pos.y);
    }  
}

function getUnitVector(x, y) {
    if (x == 0 && y == 0) {
        return { x: 0, y: 0};
    }
    var length = Math.sqrt(x * x + y * y);
    return { x: x / length, y: y / length };
}

function intersects(pos1, width1, pos2, width2) {
    return !(pos2.x > pos1.x + width1 ||
           pos2.x + width2 < pos1.x ||
           pos2.y > pos1.y + width1 ||
           pos2.y + width2 < pos1.y);
}