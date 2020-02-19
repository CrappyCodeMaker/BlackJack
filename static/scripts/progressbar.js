$(document).ready(() => {
    if (!Modernizr.meter) { alert('Извините, но Ваш браузер не поддерживает HTML5 прогресс бар!'); }
    else {
        let progressbar = $('#progressbar'),
            max = progressbar.attr('max'),
            time = (250 / max) * 5,
            value = progressbar.val();

        let loading = () => {
            value += 1;
            addValue = progressbar.val(value);

            $('.progress-value').html(value + '%');

            if (value == max) {
                clearInterval(animate);
                document.querySelector("#loadgame").className = 'endload';
                document.querySelector("#firstgame").className = 'firstgame-start';
            }
        };

        let animate = setInterval(() => { loading(); }, time);
    };
});