/* Format a topic */
function formatTopic(topic) {
  return $(`
      <div class="container topic search" id="` + id(topic) + `">
      <h3 class="mt-3">` + topic + `</h3>
      </div>`)
}

/* Format a concept */
function formatConcept(conceptContent) {
  return $(`
    <div class="concept">
       <h4 class="search" id="` + id(conceptContent["Title"]) + `">` + conceptContent["Title"] + `</h4>
       <p class="search">` + conceptContent["Description"] + `. <b>Learning&nbsp;outcomes:</br></p>
    </div>`)
}

/* Format a learningOutcome */
function formatLO(learningOutcome) {
  return $(`
    <div class="goal">
      <h5 class="search">` + learningOutcome["Title"] + `</h5>
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

/* Remove blanks from a string so we can use it as ID for a node in the HTML tree */
function id(st) {
  return st.replace(/ /g, '');
}

/* Read in the toolkit data in JSON format and insert into the page */
$.getJSON("toolkit.json", function(data) {

  $.each(data["Topics"],
    function(i, topics) {

      // loop through all the topics
      $.each(topics, function(topic, topicContent) {

        // format the topic. Everything else will be appended to this one.

        ft = formatTopic(topic)

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

                fc.append(lo)
              });

            ft.append(fc)
          });


        // after adding all information on the concept, add it to the page:
        $("main").append(ft)


      });


      //   // loop through the concepts in this topic
      //   $.each(topicContent["Concepts"],
      //     function(c, conceptContent) {
      //       htmltree += '<h4 class="space search">';
      //       htmltree += conceptContent["Title"];
      //       //htmltree += '<span class="fs-6 fw-lighter fst-italic text-end">Concept</span>
      //       htmltree += '</h4>';
      //
      //       htmltree += '<p class="search">';
      //       htmltree += conceptContent["Description"];
      //       htmltree += "</p>";
      //
      //       htmltree += '<h4 class="space">Learning outcomes:</h4>'
      //
      //       // loop through learning outcomes for this concept
      // $.each(conceptContent["Learning outcomes"],
      //   function(l, learningOutcome) {
      //
      //           htmltree += '<h5 class="space"><li class="search">';
      //           htmltree += learningOutcome["Title"];
      //           htmltree += '</h5>'
      //
      //           htmltree += '<p class="search">';
      //           htmltree += learningOutcome["Description"];
      //           htmltree += "<br />";
      //           htmltree += "Bloom level: " + learningOutcome["Bloom level"]
      //           htmltree += "</p>";
      //
      //           htmltree += '<h5 class="space">Teaching activities:</h5>'
      //
      //           // loop through teaching activities
      // $.each(learningOutcome["Teaching activies"],
      //   function(t, teachingActivity) {
      //               htmltree += '<p class="search">';
      //               htmltree += teachingActivity["Title"];
      //               htmltree += '<br />';
      //               htmltree += teachingActivity["Description"];
      //               htmltree += '</p>';
      //             });
      //
      //
      //
      //           htmltree += '<h5 class="space">Assessment:</h5>'
      //
      //           // loop through assessments
      //           $.each(learningOutcome["Assessment"],
      //             function(a, assessment) {
      //               htmltree += '<p class="search">';
      //               htmltree += assessment["Assessment method"];
      //               htmltree += '<br />';
      //               htmltree += assessment["Assessment method type"] + ' assessment: ' + assessment["Assessment method description"];
      //               htmltree += '</p>';
      //
      //             });
      //
      //           htmltree += '</ol>';
      //
      //           //htmltree += "</li>";
      //         });
      //       htmltree += "</ol>";
      //       htmltree += "</li>";
      //
      //     });
      //
      //   htmltree += "</ol>";
      //   htmltree += "</div>";
      //});
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
