const timeFormater = (time) => {
    let sec = Math.floor(time % 60)
    let min = Math.floor((time / 60) % 60)
    let hour = Math.floor((time / 3600))

    sec = sec < 10 ? `0${sec}` : sec
    min = min < 10 ? `0${min}` : min
    hour = hour < 10 ? `0${hour}` : hour

    if(hour == 0) return `${min}:${sec}`

    return `${hour}:${min}:${sec}`
}

const createThumbnail = (video) => {
    console.log(typeof video)
    video.currentTime = 15;
    const canvas = document.createElement('canvas')
    canvas.width = 600;
    canvas.height = 600;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    video.pause()
    return canvas.toDataURL('image/jpeg')
}

const videoSrcSetter = (video) => {
    const tempPath = URL.createObjectURL(video)
    // const videoFile = document.createElement('video')
    // videoFile.autoplay = true;
    // videoFile.muted = true;
    // videoFile.src = tempPath;

    // console.log(createThumbnail(videoFile))
    $('#video-src').attr('src', tempPath)
    $('#video-player')[0].load()
    $('#video-player').css('background-color', 'rgba(0, 0, 0, 0)')
    // $('#video-player').attr('controls', true)
    // $('#video-player').attr('poster', './bicycle_art_cyclist_127132_1366x768.jpg')

}

const videoFileData = (video) => {
    const file = new FileReader()
    file.readAsDataURL(video)
    file.onload = function (e) {
        $('#video-src').attr('src', e.target.result)
        $('#video-player')[0].load()
        $('#video-player').attr('controls', true)
    }
}


// get the file from the event listener
$('.video-input').on('change', function (e) {
    e.preventDefault()
    const videoData = $('.video-input')[0].files[0]

    // setting the video player's source>src to the uploaded file link

    /* solution 1 for generating temporary path of the video */
    videoSrcSetter(videoData)

    /* solution 2 for creating new file reader and can be uploaded from here */
    // videoFileData(videoData[0])
})

$('#play').on('click', function() {
    const video = $('#video-player')[0]
    if(video.paused) {
        video.play()
        $('#play').attr('name', 'pause-circle-outline')
        // $(this).text('Pause')
    } else {
        video.pause()
        $('#play').attr('name', 'play-outline')
        // $(this).text('Play')
    }
})
$('#seek-backward').on('click', function() {
    const video = $('#video-player')[0]
    video.currentTime -= 10
})
$('#seek-forward').on('click', function() {
    const video = $('#video-player')[0]
    video.currentTime += 10
})

$('#video-player').on('loadeddata', function() {
    const video = $('#video-player')[0]
    const duration = video.duration
    $('#total-time').text(timeFormater(duration))
})


$('#video-player').on('timeupdate', function() {
    const video = $('#video-player')[0]
    const duration = video.duration
    const currentTime = video.currentTime
    const cursorPointer = parseFloat((currentTime / duration) * 100).toFixed(2) * 1
    if(duration && currentTime) {
        const d = 100 - cursorPointer
        $('#progress-indicator').css('transform', `translate(${d}%, -50%)`)
        $('#progress').css('width', `${cursorPointer}%`)
    }
    if(currentTime == duration) {
        $('#play').attr('name', 'play-outline')
    }
    $('#current-time').text(timeFormater(currentTime))
})

$('.timeline-container').on('click', function(e) {
    const totalWidth = +$('.timeline-container').css('width').split('p')[0]
    const currentPointerPos = e.offsetX
    $('#progress').css('width', `${currentPointerPos}px`)
    const video = $('#video-player')[0]
    const duration = video.duration
    video.currentTime = (duration / totalWidth) * currentPointerPos
})

function dragable(e) {
    const marginLeft = ($(document).width() - $('.container').width()) / 2
    // console.log($('.container').css('margin'))
    const totalWidth = +$('.timeline-container').css('width').split('p')[0]
    const currentPointerPos = e.clientX - marginLeft
    $('#progress').css('width', `${currentPointerPos}px`)
    const video = $('#video-player')[0]
    const duration = video.duration
    video.currentTime = (duration / totalWidth) * currentPointerPos
}

$('.timeline-container').on('mousedown', function() {
    $('.timeline-container').on('mousemove', dragable)
})
$(document).on('mouseup', function() {
    $('.timeline-container').off('mousemove', dragable)
})

$('#volume').on('click', function() {
    const video = $('#video-player')[0]
    const volume = $(this).attr('name')
    if(volume == 'volume-mute-outline'){
        $(this).attr('name', 'volume-high-outline')
        video.volume = 1
    } else {
        $(this).attr('name', 'volume-mute-outline')
        video.volume = 0
    }
})

$('#pip').on('click', function() {
    const video = $('#video-player')[0]
    video.requestPictureInPicture()
})

$('#volume-input').on('input', function(e) {
    const volumeValue =  e.target.value
    const video = $('#video-player')[0]
    video.volume = volumeValue
    if(volumeValue == 0){
        $('#volume').attr('name', 'volume-mute-outline')
    } else {
        $('#volume').attr('name', 'volume-high-outline')
    }
})