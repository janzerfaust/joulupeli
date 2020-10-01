
(function () {

    var ajaxdiv = document.getElementById("ajaxdiv");
    var ajaxpisteet = document.getElementById("pisteet");
    function ajax(url, callback) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.onreadystatechange = function () {
            if (req.status === 200 && req.readyState === 4) {
                callback(JSON.parse(req.responseText));
            }
        }
        req.send();
    }

    ajax("php/scores.php?action=topscore", function (data) {
        if (data.error) {
            //throw data.error;
        }
        for (var i = 0; i < data.scores.length; i++) {
            var s = data.scores[i];
            var pistediv = document.createElement("div");
            var userdiv = document.createElement("div");
            var scorediv = document.createElement("div");

            pistediv.className = "pistediv";
            userdiv.className = "user";
            scorediv.className = "score";

            userdiv.innerHTML = s.user;
            scorediv.innerHTML = s.score;
            pistediv.appendChild(userdiv);
            pistediv.appendChild(scorediv);
            ajaxpisteet.appendChild(pistediv);
        }
    });

    document.getElementById("submitscore").onclick = function () {
        var user = document.getElementById("username").value;
        var score = document.getElementById("showscore").innerHTML;
        ajax("php/scores.php?action=add&u=" + user + "&s=" + score, function () {
            location.reload();
        });
    }
    document.getElementById("username").onkeydown = function (e) {
        if (e.keyCode === 13) {
            var user = document.getElementById("username").value;
            var score = document.getElementById("showscore").innerHTML;
            ajax("php/scores.php?action=add&u=" + user + "&s=" + score, function () {
                location.reload();
            });
        }
    }
       
    

})();