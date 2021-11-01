$.getJSON("toolkit.json", function(data) {

  htmltree = "<ol>";

  $.each(data["Topics"],
    function(i, topics) {

      // loop through the topics
      $.each(topics,
        function(topic, topicContent) {
          htmltree += '<h2 class="space"><li class="search">';
          htmltree += topic;
          htmltree += ' <span class="fs-6 fw-lighter fst-italic text-end">Topic</span></h2>';

          htmltree += "<ol>";
          // loop through the concepts in this topic
          $.each(topicContent["Concepts"],
            function(c, conceptContent) {
              htmltree += '<h3 class="space"><li class="search">';
              htmltree += conceptContent["Title"];
              htmltree += '<span class="fs-6 fw-lighter fst-italic text-end">Concept</span></h3>';

              htmltree += '<p class="search">';
              htmltree += conceptContent["Description"];
              htmltree += "</p>";

              htmltree += '<h4 class="space">Learning outcomes:</h4>'
              htmltree += '<ol>';

              // loop through learning outcomes for this concept
              $.each(conceptContent["Learning outcomes"],
                function(l, learningOutcome) {

                  htmltree += '<h5 class="space"><li class="search">';
                  htmltree += learningOutcome["Title"];
                  htmltree += '</h5>'

                  htmltree += '<p class="search">';
                  htmltree += learningOutcome["Description"];
                  htmltree += "<br />";
                  htmltree += "Bloom level: " + learningOutcome["Bloom level"]
                  htmltree += "</p>";

                  htmltree += '<h5 class="space">Teaching activities:</h5>'
                  htmltree += '<ol>';

                  // loop through teaching activities
                  $.each(learningOutcome["Teaching activies"],
                    function(t, teachingActivity) {
                      htmltree += '<li class="search">';
                      htmltree += teachingActivity["Title"];
                      htmltree += '<br />';
                      htmltree += teachingActivity["Description"];
                      htmltree += '</li>';
                    });

                  htmltree += '</ol>';

                  htmltree += '<h5 class="space">Assessment:</h5>'
                  htmltree += '<ol>';
                  // loop through assessments
                  $.each(learningOutcome["Assessment"],
                    function(a, assessment) {
                      htmltree += '<li class="search">';
                      htmltree += assessment["Assessment method"];
                      htmltree += '<br />';
                      htmltree += assessment["Assessment method type"] + ' assessment: ' + assessment["Assessment method description"];
                      htmltree += '</li>';

                    });

                  htmltree += '</ol>';

                  htmltree += "</li>";
                });
              htmltree += "</ol>";
              htmltree += "</li>";

            });

          htmltree += "</ol>";
          htmltree += "</li>";
        });
    });

  htmltree += "</ol>";

  $("div#content").append(htmltree);

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
