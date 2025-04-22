 // Set the deadline for both timers (use same deadline for simplicity)
    var deadline = new Date("March 25, 2025 00:00:00").getTime();

    // Function to update the first countdown
    function updateCountdown1() {
        var now = new Date().getTime();
        var timeLeft = deadline - now;

        var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Update the first countdown display
        document.getElementById("countdown1").innerHTML = days + " days: " + hours + " hours: " + minutes + " minutes: " + seconds + " seconds";

        if (timeLeft < 0) {
            clearInterval(timer1);
            document.getElementById("countdown1").innerHTML = "EXPIRED";
        }
    }

    // Function to update the second countdown (live-box)
    function updateCountdown2() {
        var now = new Date().getTime();
        var timeLeft = deadline - now;

        var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Update the second countdown display
        document.getElementById("days").innerHTML = days + "D : ";
        document.getElementById("hours").innerHTML = hours + "H : ";
        document.getElementById("minutes").innerHTML = minutes + "M : ";
        document.getElementById("seconds").innerHTML = seconds + "S";

        if (timeLeft < 0) {
            clearInterval(timer2);
            document.getElementById("days").innerHTML = "00D : ";
            document.getElementById("hours").innerHTML = "00H : ";
            document.getElementById("minutes").innerHTML = "00M : ";
            document.getElementById("seconds").innerHTML = "00S";
        }
    }

    // Set intervals for both timers to update every second
    var timer1 = setInterval(updateCountdown1, 1000);
    var timer2 = setInterval(updateCountdown2, 1000);