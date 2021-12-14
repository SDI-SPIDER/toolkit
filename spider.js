/* Search function that is triggered every time the
user changes one of the form fields */
function search() {

  term     = $("#searchField").val()
  bloom    = $( "#bloomSelect option:selected" ).val();
  activity = $( "#activitySelect option:selected" ).val();

  // reset:
  $(".hit, .pale").addClass("search").removeClass("hit pale")
  $(".stabilo").each(function(){
      $( this ).replaceWith($( this ).text())
  })


  // only start highlighting the "hits" after at least
  // 2 characters have been typed
  if (term.length > 1){
    $(".search:contains(" + term + ")").addClass('hit').removeClass('search')
  }

  // if there are any hits, make the remaining search boxes semi-transparent
  if ($(".hit").length > 0){
    $(".search").addClass("pale").removeClass("search")  }

    // highlight the whole word including the search term:
    $(".hit").each(function(){
        oldHTML = $( this ).html()
        $( this ).html(oldHTML.replace(new RegExp('(\\b)( \\w*' + term + '\\w*)(\\b)', 'gi'), "<span class='stabilo'>$&</span>"))
    })



  ;

}

/* Format a topic */
function formatTopic(topic) {
  return $(`
      <div class="topic clearfix" id="` + id(topic) + `">
      <h1 class="display-3">` + topic + `
      <span class="display-5">concepts:</span></h1>
      </div>`)
}

/* Format a concept */
function formatConcept(conceptContent) {
  return $(`
    <div class="concept search">
       <h2 id="` + id(conceptContent["Title"]) + `">
       ` + conceptContent["Title"] + `</h2>
       <p class="lead">` + conceptContent["Description"] + `. <strong>Learning&nbsp;outcomes:</strong></p>
    </div>`)
}

/* Format a learningOutcome */
function formatLO(learningOutcome) {
  return $(`
    <div class="goal">
      <h3>` + learningOutcome["Title"] + `</h3>
      <p>` + learningOutcome["Description"] + `<br />
             Bloom level: ` + learningOutcome["Bloom level"] + `</p>
    </div>`);
}

/* Format a teachingActivity */
function formatTA(ta) {
  return $(`
    <li id="` + id(ta['Title'] + ta['Description']) + `">
    <strong>` + ta['Title'] + `</strong>:
    ` + ta['Description'] + `
    </li>`);
}

/* Format an assessment method */
function formatAssessment(assessment) {
  return $(`
    <div class="assessment">
      <h4>` + assessment["Assessment method type"] + ` assessment</h4>
      <p><strong>` + assessment["Assessment method"] + `</strong>:
      ` + assessment["Assessment method description"] + `</p>
    </div>
    `);
}

/* Format the materials for a learning outcome */
function formatMaterials(materials) {
  return $(`
    <div class="materials">
      <p><strong>Materials</strong><br />
      ` + materials + `</p>
    </div>
    `);
}

/* Remove blanks from a string so we can use it as ID for a node in the HTML tree */
function id(st) {
  return st.replace(/ /g, '');
}

/* Add a button at the top of the page that works as a direct link to the topic */
function addTopicButton(topic) {
  $('#topic-buttons').append('<a role="button" class="btn btn-outline-secondary topicbutton" href="#' + id(topic) + '">' + topic + '</a>');
}

/* Read in the toolkit data in JSON format and insert into the page */
$.getJSON("toolkit.json", function(data) {

  // keep track of all kinds of teaching activities
  // and bloom levels found in the Data
  // so we can add them to the selection menues later
  activities = []
  blooms = []

  $.each(data["Topics"],
    function(i, topics) {

      // loop through all the topics
      $.each(topics, function(topic, topicContent) {

        // format the topic. Everything else will be appended to this one.

        ft = formatTopic(topic)
        addTopicButton(topic)

        // loop through concepts in this topic
        $.each(topicContent["Concepts"],
          function(c, conceptContent) {

            // add title and description for each concept
            fc = formatConcept(conceptContent)

            $.each(conceptContent["Learning outcomes"],
              function(l, learningOutcome) {
                lo = formatLO(learningOutcome)

                //keep track of all bloom levels used in the data
                // so we can list them in the drop down selection
                // menu at the end

                if (!blooms.includes(learningOutcome["Bloom level"])) {
                  blooms.push(learningOutcome["Bloom level"])
                }

                lo.append('<p>Teaching activities:</p>')
                taHeader = $("<ol class='activities'></ol>")

                // teaching activities for this LO:
                $.each(learningOutcome["Teaching activies"],
                  function(t, teachingActivity) {

                    // keep track of activity types:
                    if (!activities.includes(teachingActivity["Title"])) {
                      activities.push(teachingActivity["Title"])
                    }

                    ta = formatTA(teachingActivity)

                    // add any potential materials to this activity:
                    if (teachingActivity["Materials"]) {
                      ta.append(formatMaterials(teachingActivity["Materials"]))
                    }

                    taHeader.append(ta)
                  });
                lo.append(taHeader)

                $.each(learningOutcome["Assessment"],
                  function(l, assessment) {
                    lo.append(formatAssessment(assessment))
                  });

                fc.append(lo)
              });

            ft.append(fc)

          });


        // after adding all information on the concept, add it to the page:
        $("main").append(ft)

      });

      // add all bloom levels discovered in the data to the select menu
      blooms.sort().forEach(item => $("#bloomSelect").append("<option>" + item + "</option>"));

      // same for the activities
      activities.sort().forEach(item => $("#activitySelect").append("<option>" + item + "</option>"));

      // update the topic counter at the top of the page:
      $("span#topiccount").text($("a.topicbutton").length)

    });


  // after adding the whole content to the page, add a change listener to the search field:

  // to do that, we'll first override jQuery's 'contains' selector to
  // ignore case (https://stackoverflow.com/questions/8746882/jquery-contains-selector-uppercase-and-lower-case-issue)

  jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
  };

  // when any of the form fields change, call the search function:
  $(".trigger").on("change", search);
  $("#searchField").on("input", search);


});
