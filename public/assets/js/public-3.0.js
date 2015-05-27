(function (window, Model) {
    window.request = Model.initialize();
    window.opts = {};
}(window, window.Model));

$(".chosen").chosen({
    no_results_text: "Oops, nothing found!",
    width: "95%"
});

$(document).ready(function () {
    
    var dt = new Date(),
        starttime = dt.getTime();
        window.opts.time = starttime;
    
    $('#new_category li').click(function (e) {
        window.opts.query = $(this).children('span').html();
        window.opts.page = '1';
        $('#results').html('');
        $('#results').html('<p id="loader" class="text-center"><i class="fa fa-spinner fa-spin fa-5x"></i></p>');
        loadOpportunities(opts);
    });

    $('#search_opportunities').submit(function (e) {
        e.preventDefault();
        window.opts = {};
        var data = $(this).serializeArray();
        $.each(data, function () {
            if (window.opts[this.name] !== undefined) {
                if (!window.opts[this.name].push) {
                    window.opts[this.name] = [window.opts[this.name]];
                }
                window.opts[this.name].push(this.value || '');
            } else {
                window.opts[this.name] = this.value || '';
            }
        });
        $('#results').html('');
        $('#results').html('<p id="loader" class="text-center"><i class="fa fa-spinner fa-spin fa-5x"></i></p>');
        loadOpportunities(window.opts);
        $('#loader').html('');
    });

    $('#load_opportunities').click(function (e) {
        $(this).html('<i class="fa fa-spinner fa-spin"></i> Loading');
        loadOpportunities(window.opts);
        $(this).html('Load More');
    });

    setInterval(loadSponsored({
        limit: 3
    }), 5000);

    $('#apply_internship').click(function (e) {
        var self = this,
                path = window.location.pathname.split("/");
        $(self).addClass('disabled');
        $(self).html('<i class="fa fa-spinner fa-spin"></i>  | Processing...');

        request.read({
            action: 'students',
            data: {},
            callback: function (person) {
                request.create({
                    action: path[1] + '/' + path[2] + '/' + path[3],
                    data: {
                        action: "application",
                        opportunity_id: path[3]
                    },
                    callback: function (data) {
                        console.log(data);
                        $(self).html('Applied Successfully');
                    }
                });
            }
        });

    });
    
    //onlinetest
    $('#search_test').submit(function (e) {
        e.preventDefault();
        window.opts = {};
        var data = $(this).serializeArray();
        $.each(data, function () {
            if (window.opts[this.name] !== undefined) {
                if (!window.opts[this.name].push) {
                    window.opts[this.name] = [window.opts[this.name]];
                }
                window.opts[this.name].push(this.value || '');
            } else {
                window.opts[this.name] = this.value || '';
            }
        });
        $('#results').html('');
        $('#results').html('<p id="loader" class="text-center"><i class="fa fa-spinner fa-spin fa-5x"></i></p>');
        loadTests(window.opts);
        $('#loader').html('');
    });

    $('#load_test').click(function (e) {
        $(this).html('<i class="fa fa-spinner fa-spin"></i> Loading');
        loadTests(window.opts);
        $(this).html('Load More');
    });
    
    //test
    $('#prevQues').click(function (e) {
        e.preventDefault();
        var ques = window.opts.ques,
            prev = "#question_" + (+ques + -1),
            cur  = "#question_" + ques,
            self = this;
        if($(prev).length > 0){
            $(cur).addClass('hide');
            $(prev).removeClass('hide');

            window.opts.ques = --ques;
        } else {
            $(self).addClass('disabled');
        }
        console.log(window.opts.ques);
    });
    
    $('#nextQues').click(function (e) {
        e.preventDefault();
        var ques = window.opts.ques,
            next = "#question_" + (+ques + +1),
            cur  = "#question_" + ques,
            self = this;
        if($(next).length > 0){
            $(cur).addClass('hide');
            $(next).removeClass('hide');
            
            window.opts.ques = ++ques;
        } else {
            $(self).addClass('disabled');
        }
        console.log(window.opts.ques);
    });

    $('#test').submit(function (e) {
        e.preventDefault();
        var test_id = $('input[name="test_id"]').val();
        
        var test = data[0];
        if (test.time_limit != '0') {
            var timeSpent = test.time_limit;
            function countdown() {
                console.log(timeSpent);
                timeSpent -= 1;
                if (timeSpent > 0) {
                    setTimeout(countdown, 1000);
                }
                if (timeSpent == 1) {
                    alert('submitted');
                    submitTest();
                }
                ;
            }
            setTimeout(countdown, 1000);
        }
    });
});

function findResume(resumes) {
    var id = "";
    $.each(resumes, function (i, resume) {
        if (resume._type == "file") {
            id = resume._id;
        }
    });
    return id;
}

function loadOpportunities(opts) {
    request.read({
        action: "home/index",
        data: opts,
        callback: function (data) {
            $('#loader').html('');
            if (data.count > 1) {
                $.each(data.opportunities, function (i, opportunity) {
                    $('#results').append('<tr><td><div class="media"><a class="pull-left hidden-xs" href="' + encodeURI(opportunity._title) + '/' + opportunity._id + '"><img src="/organizations/photo/' + opportunity._organization_id + '" class="media-object small_image" alt="' + opportunity._title + '"></a><div class="media-body"><h4 class="media-heading"><a href="' + encodeURI(opportunity._title) + '/' + opportunity._id + '">' + opportunity._title + '</a></h4>' + opportunity._eligibility + '</div></div></td><td class="job-location"><p><i class="fa fa-calendar fa-fw"></i>' + opportunity._last_date + '</p><p><i class="fa fa-map-marker"></i>' + opportunity._location + '</p></td></tr>');
                });
            } else {
                $('#results').append("No Results Found, Check later");
            }
        }
    });
}

function loadTests(opts) {
    request.read({
        action: "onlinetest/index",
        data: opts,
        callback: function (data) {
            $('#loader').html('');
            console.log(data);
            if (data.count >= 1) {
                $.each(data.exams, function (i, exam) {
                    $('#results').append('<div class="col-sm-4 col-md-3"><div class="thumbnail"><a href="test/'+encodeURI(exam._title)+'/'+exam._id+'"><img src="/onlinetest/photo/'+exam._id+'" alt="'+exam._title+'" width="100"></a><div class="caption"><p><b>'+exam._title+'</b></p><p><a href="test-details/'+encodeURI(exam._title)+'/'+exam._id+'" class="btn btn-primary">Details</a><a href="test/'+encodeURI(exam._title)+'/'+exam._id+'" class="btn btn-success" id="taketest">Start Test</a></p></div></div></div>');
                });
            } else {
                $('#results').append("No Results Found, Check later");
            }
        }
    });

}

function login() {
    request.read({
        action: "students/register",
        callback: function (data) {
            if (data.url) {
                window.location.href = data.url;
            }
        }
    });
}

function loadSponsored(opts) {
    request.read({
        action: "home/sponsored",
        data: opts,
        callback: function (data) {
            if (data.sponsoreds) {
                $.each(data.sponsoreds, function (i, opportunity) {
                    $('#results').prepend('<tr class="featured"><td><div class="media"><a class="pull-left hidden-xs" href="' + encodeURI(opportunity._title) + '/' + opportunity._id + '"><img src="http://assets.swiftintern.com/uploads/images/sml_7921790.jpg" class="media-object small_image" alt="' + opportunity._title + '"></a><div class="media-body"><h4 class="media-heading"><a href="' + encodeURI(opportunity._title) + '/' + opportunity._id + '">' + opportunity._title + '</a></h4>' + opportunity._eligibility + '</div></div></td><td class="job-location"><p><i class="fa fa-calendar fa-fw"></i>' + opportunity._last_date + '</p><p><i class="fa fa-map-marker"></i>' + opportunity._location + '</p></td></tr>');
                });
            }
        }
    });
}

function createApplication(opts) {
    console.log(opts);
    request.create({
        action: opts.url,
        data: opts,
        callback: function (data) {

        }
    });
}

function toObject(data) {
    var obj = {};
    $.each(data, function () {
        if (obj[this.name] !== undefined) {
            if (!obj[this.name].push) {
                obj[this.name] = [obj[this.name]];
            }
            obj[this.name].push(this.value || '');
        } else {
            obj[this.name] = this.value || '';
        }
    });
    return obj;
}