$(document).ready(function(){
    $("#image").change(async function(){
        const data = new FormData($('#upload_btn')[0]);
        let uploadResult = await uploadStatus(data);
        let checkProcessedImg = getProcessedImg(uploadResult);
    });
});

function uploadStatus(data){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: '/upload',
            type: 'POST',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            //success: res => alert(res.filename),
            success: (res) => {
                resolve(res.filename);
                $("#img_in").attr('src', `/uploads/${res.filename}`).fadeIn();
            },
            //success: (res) => $.get("/uploaded/" + res.filename, (data) => {$("#img_list").attr('src', data)}),
            //success: () => $('#img_list').fadeIn(),
            error: () => alert('Error in sending the request!')
        });
    });
}

function getProcessedImg(filename){
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `/processed/${filename}`,
            type: 'GET',
            success: (data) => {
                if(data.message === 'File exist'){
                    $("#img_out").attr('src', `/outputs/${filename}`).fadeIn();
                } else {
                    setTimeout(getProcessedImg, 3000, filename);
                }
            }
        });
    });
}