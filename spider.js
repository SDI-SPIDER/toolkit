/* Search function that is triggered every time the
user changes one of the form fields */
function search() {

  term = $("#searchField").val()
  bloom = $("#bloomSelect option:selected").val();
  activity = $("#activitySelect option:selected").val();

  // reset:
  $(".hit, .hide").removeClass("hit hide")
  $(".concept").addClass("search")
  $("span.stabilo").each(function() {
    $(this).replaceWith($(this)[0].innerText)
  })
  //remove hightlighted TAs:
  $("li.stabilo").removeClass("stabilo")

  // collapse all learning outcomes:
  // $("div.panel-collapse").not(".show").parent().addClass("hide")
  $("div.panel-collapse").removeClass("show")



  // only start highlighting the "hits" after at least
  // 2 characters have been typed
  if (term.length > 1) {
    // figure out whether the search should be limited to a given bloom level:
    if (bloom == "Any Bloom level"){
      bloomClass = ".learningOutcome"
    } else {
      bloomClass = "."+id(bloom)
    }

    // mark the concepts that contain a match ("hit")
    $("div.concept.search:contains(" + term + ")").addClass('hit').removeClass('search')

    // "un-collapse" all learning outcomes that contain the search term:
    $("div"+bloomClass+":contains(" + term + ")").addClass('show')
    // completely hide the others:
    $("div.panel-collapse").not(".show").parent().addClass("hide")
  }

  // if there are any hits, hide the concepts that don't have any hits
  if ($(".hit").length > 0) {
    $(".search").addClass("hide").removeClass("search")
  }

  // highlight the words containing the search string
  $(".hit").find('*').each(function() {
    $.each(this.childNodes, function() {
      if (this.nodeType === 3) {
        // find all words containing our search term (whole word!)
        regex = new RegExp('\\b\\w*' + term + '\\w*\\b', 'gi')
        //surround it with a span to style it
        replacement = this.data.replace(regex, "<span class='stabilo'>$&</span>")
        // ... and replace the whole node with the updated content
        this.replaceWith($("<span>" + replacement + "</span>")[0]);
      }
    })
  });

  // highlight the TAs matching the selected TA:
  if(activity != "Any activity type"){
    $("li."+id(activity)).addClass("stabilo")
  }

  // update
  updateCounter()


}


// resets the search form to show all toolkit content
function resetSearchForm(){
  $("#searchField").val("")
  $("#bloomSelect").val("Any Bloom level");
  $("#activitySelect").val("Any activity type");
  search();
}

// update the conceptcounter and hide/show the "show all concepts" link
function updateCounter() {
  ccount = $("div.concept").length
  hcount = $("div.concept.hide").length

  if (hcount == 0) {
    $("span#conceptcounter").text("all " + ccount)
    $("a#resetfilter").addClass("hidelink")
  } else {
    $("span#conceptcounter").text(ccount-hcount + " out of " + ccount)
    $("a#resetfilter").removeClass("hidelink")
  }

  // update the individual counters for each topic:
  $("div.topic").each(function(){
    thisTopic = this.id;
    // count the visible concepts under this topic:
    numConcepts = $(this).find("div.concept").length
    hiddenConcepts = $(this).find("div.concept.hide").length

    if(hiddenConcepts == 0){
        $("span.conceptcounter."+thisTopic).text(numConcepts)
    }else{
        $("span.conceptcounter."+thisTopic).text((numConcepts-hiddenConcepts)+"/"+numConcepts)
    }

  })

}

/* Format a topic */
function formatTopic(topic) {
  return $(`
      <div class="topic clearfix" id="` + id(topic) + `">
      <h1 class="display-3">` + topic + `.
      <span class="display-5"><span class="conceptcounter ` + id(topic) + `"></span> concepts:</span></h1>
      </div>`)
}

/* Format a concept */
function formatConcept(conceptContent) {
  return $(`
    <div class="concept search panel-group">
       <h2 id="` + id(conceptContent["Title"]) + `">
       ` + conceptContent["Title"] + `</h2>
       <p class="lead">` + conceptContent["Description"] + `. <strong>Learning&nbsp;outcomes:</strong></p>
    </div>`)
}

/* Format a learningOutcome panel header  */
function formatLOPanelHeader(learningOutcome) {
  return $(`
    <div class="panel panel-default">
      <div class="panel-heading goal">
        <h3 class="panel-title">
          <a data-bs-toggle="collapse" href="#collapse` + id(learningOutcome["Title"]) + `">` + learningOutcome["Title"] + `</a>
        </h3>
      </div>
    </div>`);
}

function formatLOPanelBody(learningOutcome) {
  return $(`<div id="collapse` + id(learningOutcome["Title"]) + `" class="panel-collapse learningOutcome collapse ` + id(learningOutcome["Bloom level"]) + `">
</div>`);
}

function formatLOPanelBodyContent(learningOutcome) {
  return $(`<div class="goal panel-body"><p>` + learningOutcome["Description"] + `<br />
         <strong>Bloom level: ` + learningOutcome["Bloom level"] + `</strong></p>
         <p>Teaching activities:</p>
  </div>`);
}

/* Format a teachingActivity */
function formatTA(ta) {
  return $(`
    <li class="teachingActivity `+ id(ta['Title']) +`" id="` + id(ta['Title'] + ta['Description']) + `">
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

/* Remove blanks and punctuation from a string so we can use it as ID for a node in the HTML tree */
function id(st) {
  return st.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
}

/* Add a button at the top of the page that works as a direct link to the topic */
function addTopicButton(topic) {
  $('#topic-buttons').append('<a role="button" class="btn btn-outline-dark topicbutton" href="#' + id(topic) + '">' + topic + '</a>');
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


                //keep track of all bloom levels used in the data
                // so we can list them in the drop down selection
                // menu at the end; ignore the empty ones

                if (!blooms.includes(learningOutcome["Bloom level"]) && learningOutcome["Bloom level"] != "") {
                  blooms.push(learningOutcome["Bloom level"])
                }



                // teaching activities for this LO:
                taList = $('<ol id ="TAs`+id(learningOutcome["Title"])+`" class="activities" ></ol>')

                $.each(learningOutcome["Teaching activies"],
                  function(t, teachingActivity) {

                    // keep track of activity types; ignore the empty ones
                    if (!activities.includes(teachingActivity["Title"]) && teachingActivity["Title"] != "") {
                      activities.push(teachingActivity["Title"])
                    }

                    ta = formatTA(teachingActivity)

                    // add any potential materials to this activity:
                    if (teachingActivity["Materials"]) {
                      ta.append(formatMaterials(teachingActivity["Materials"]))
                    }

                    taList.append(ta)
                  });

                // re-assable: List of teaching activities to panel body content
                lopbc = formatLOPanelBodyContent(learningOutcome)
                lopbc.append(taList)

                // assessment methods to the body content:
                $.each(learningOutcome["Assessment"],
                  function(l, assessment) {
                    lopbc.append(formatAssessment(assessment))
                  });

                // … panel body content to panel body
                lopb = formatLOPanelBody(learningOutcome)
                lopb.append(lopbc)

                // panel body to panel header
                loph = formatLOPanelHeader(learningOutcome)
                loph.append(lopb)

                // attach the whole learning objective to the concept
                fc.append(loph)
              });

            // and finally the concept to the topic
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

      // update the concept counter:
      updateCounter()

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

  $("a#resetfilter").on("click", resetSearchForm);
});
