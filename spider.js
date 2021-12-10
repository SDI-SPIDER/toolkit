/* Format a topic */
function formatTopic(topic) {
  return $(`
      <div class="container topic search" id="` + id(topic) + `">
      <h1 class="mt-3">` + topic + `</h1>
      </div>`)
}

/* Format a concept */
function formatConcept(conceptContent) {
  return $(`
    <div class="concept">
       <h2 class="search" id="` + id(conceptContent["Title"]) + `">` + conceptContent["Title"] + `</h2>
       <p class="search lead">` + conceptContent["Description"] + `. <b>Learning&nbsp;outcomes:</br></p>
    </div>`)
}

/* Format a learningOutcome */
function formatLO(learningOutcome) {
  return $(`
    <div class="goal">
      <h3 class="search">` + learningOutcome["Title"] + `</h3>
      <p class="search">` + learningOutcome["Description"] + `<br />
             Bloom level: ` + learningOutcome["Bloom level"] + `</p>
    </div>`);
}

/* Format a teachingActivity */
function formatTA(teachingActivity) {
  return $(`
    <li><b>` + teachingActivity['Title'] + `</b>:
    ` + teachingActivity['Description'] + `
    </li>`);
}

/* Format an assessment method */
function formatAssessment(assessment) {
  return $(`
    <div class="assessment">
      <h4>` + assessment["Assessment method type"]+ ` assessment</h4>
      <p><strong>` + assessment["Assessment method"] + `</strong>: ` + assessment["Assessment method description"] + `</p>
    </div>
    `);
}

/* Remove blanks from a string so we can use it as ID for a node in the HTML tree */
function id(st) {
  return st.replace(/ /g, '');
}

/* Add a button at the top of the page that works as a direct link to the topic */
function addTopicButton(topic){
  console.log("adding " +topic)
    //$('#topic-buttons').append('<a class="btn btn-primary" href="#' + topic + '" role="button">' + topic + '</a>&nbsp;')
    $('#topic-buttons').append('<a role="button" class="btn btn-outline-secondary" href="#'+id(topic)+'">'+topic+'</a>');
}

/* Read in the toolkit data in JSON format and insert into the page */
$.getJSON("toolkit.json", function(data) {

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
                lo.append('<p>Teaching activities:</p>')
                taHeader = $("<ol class='activities'></ol>")

                // teaching activities for this LO:
                $.each(learningOutcome["Teaching activies"],
                  function(t, teachingActivity) {
                    ta = formatTA(teachingActivity)

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

    });


  // after adding the whole content to the page, add a change listener to the search field:

  // to do that, we'll first override jQuery's 'contains' selector to
  // ignore case (https://stackoverflow.com/questions/8746882/jquery-contains-selector-uppercase-and-lower-case-issue)

  jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
  };

  $("#searchField").on("input", function() {
    $(".search").css('background-color', 'white')
    if ($(this).val().length > 0) {
      $(".search:contains(" + $(this).val() + ")").css('background-color', 'yellow')
    }
  });


});
