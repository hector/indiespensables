$(function () {
    SC.initialize({
        client_id: '26c48679f3cfd3c12b827bcf82d63df8'
    });

    var format = function (str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(m, number) {
            return typeof args[parseInt(number) + 1] != 'undefined' ? args[parseInt(number) + 1] : m;
        });
    };

    var template = '\
        <div class="separator cover_art" style="clear: both; text-align: center;">\
            <a href="{0}"  imageanchor="1" style="margin-left: 1em; margin-right: 1em;">\
                <img border="0" src="{0}" height="400" width="400" />\
            </a>\
        </div>\
        <div class="separator soundcloud_player" style="clear: both; text-align: center;">\
            <iframe frameborder="no" height="166" scrolling="no" width="100%"\
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{1}&amp;color=ED1E79&amp;auto_play=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false">\
            </iframe>\
        </div>';

    //var postText = '<div class="post_text" style="text-align: justify;">Lorem</div>';

    var code = $('#code');

    $('#generate-btn').click(function () {
        $('#spinner').show();
        code.html('generating...');
        var track_url = $('#url-input').val();
        SC.get('/resolve', {url: track_url}, function (track) {
            var img = track.artwork_url;
            if (img == null) {
                img = "PASTE_IMAGE_URL";
                error('Image could not be found. Paste your own image url into the code')
            } else img = img.substring(0, img.length - 9) + 't500x500.jpg';
            var content = format(template, img, track.id);
            code.text(content);
            $('#post-preview-content').html(content);
            $('#spinner').hide();
            $('#post-preview').slideDown(1000);
        })
    });

    // Select all input text on click
    $('#url-input').click(function () {
        $(this).select();
    });

    // Toggle code visibility
    $('#show-code').click(function () {
       $('#code').slideToggle();
    });

    // Notifications
    var notify = function (text, type) {
        noty({
            text: text,
            type: type,
            theme: 'relax',
            layout: 'topRight',
            timeout: 4000
        });
    };
    var success = function (text) {
        notify(text, 'success');
    };
    var error = function (text) {
      notify(text, 'error');
    };

    // Copy To Clipboard code
    var client = new ZeroClipboard(document.getElementById("copy-btn"));
    client.on("ready", function(readyEvent) {
        // alert( "ZeroClipboard SWF is ready!" );

        client.on("aftercopy", function(event) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            success("Post copied to clipboard :)");
        } );
    } );
});