/* Search function that is triggered every time the
user changes one of the form fields */
function search() {

  // check what we're looking for
  term = $("#searchField").val()

  // reset everything from the previous search:
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
  $("div.panel div.panel-heading h3 a").addClass('collapsed')



  // only start highlighting the "hits" after at least
  // 2 characters have been typed
  if (term.length > 1) {

    // mark the concepts that contain a match ("hit")
    $("div.concept.search:contains(" + term + ")").addClass('hit').removeClass('search')

    // "un-collapse" all learning outcomes that contain the search term:
    $("div.learningOutcome:contains(" + term + ")").addClass('show')
    $("div.panel:contains(" + term + ") div.panel-heading h3 a").removeClass('collapsed')
    // completely hide the others:
    $("div.panel-collapse").not(".show").parent().addClass("hide")
  }

  // if there are any hits, hide the concepts that don't have any hits
  if ($(".hit").length > 0) {
    $(".search").addClass("hide").removeClass("search")
  }

  // highlight the words containing the search string
  if (term.length > 1) { // only if at least 2 characters have been entered!
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
  }

  // update
  updateCounter()
}


// resets the search form to show all toolkit content
function resetSearchForm() {
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
    $("span#conceptcounter").text("All " + ccount)
    $("#resetfilter").addClass("hidelink")
    $("#resetter").removeClass("btn-outline-primary").addClass("btn-outline-secondary disabled")
  } else {
    $("span#conceptcounter").text(ccount - hcount + "/" + ccount)
    $("#resetfilter").removeClass("hidelink")
    $("#resetter").removeClass("btn-outline-secondary disabled").addClass("btn-outline-primary")
  }

  // update the individual counters for each topic:
  $("div.topic").each(function() {
    thisTopic = this.id;
    // count the visible concepts under this topic:
    numConcepts = $(this).find("div.concept").length
    hiddenConcepts = $(this).find("div.concept.hide").length

    if (hiddenConcepts == 0) {
      $("span.conceptcounter." + thisTopic).text(numConcepts)
    } else {
      $("span.conceptcounter." + thisTopic).text((numConcepts - hiddenConcepts) + "/" + numConcepts)
    }
  })

  // update the individual counters for each concept:
  $("div.loList").each(function() {
    thisConcept = this.id.slice(8); 	//ignore "collapse" (8) in id
    // count the visible LO under this concept:
    numLo = $(this).find("div.panel").length
    hiddenLo = $(this).find("div.panel.hide").length

    if (hiddenLo == 0) {
      $("span.locounter." + thisConcept).text(numLo)
    } else {
      $("span.locounter." + thisConcept).text((numLo - hiddenLo) + "/" + numLo)
    }
  })
}

/* Format a topic */
function formatTopic(topic) {
  return $(`
      <div class="topic clearfix" id="` + id(topic) + `">
		<div class="ban no-print ` + id(topic) + `">
			<h1 class="display-3">` + topic + `.<span class="display-5"><span class="conceptcounter ` + id(topic) + `"></span> concepts:</span></h1>
		</div>
      </div>`)
}

/* Format a concept */
function formatConcept(conceptContent) {
  return $(`
    <div class="concept search panel-group no-print">
	   <div id="` + id(conceptContent["Title"]) + `" class="anchor"></div>
       <h2>
       ` + conceptContent["Title"] + `</h2>
       <p class="lead">` + conceptContent["Description"] + `.</p>
    </div>`)
}

/* Format a learningOutcomepanel */
function formatLOList (conceptContent) {
	return $(`
		<div id="collapse` + id(conceptContent["Title"]) + `" class="collapse loList">
			<p class="lead">Students are able to ...</p>
		</div>
	`);
}

function formatLOListLink (conceptContent) {
	return $(`
	   <a data-bs-toggle="collapse" class="lead collapseLO collapsed" href="#collapse` + id(conceptContent["Title"]) + `"><span class="locounter ` + id(conceptContent["Title"]) + `"></span> learning outcomes</a>
	`);
}

/* Format a learningOutcome panel header  */
function formatLOPanelHeader(learningOutcome) {
  return $(`
    <div class="panel panel-default">
	  <div id="` + id(learningOutcome["Title"]) + `" class="anchor"></div>
      <div class="panel-heading goal">
        <h3 class="panel-title">
          <a data-bs-toggle="collapse" class="collapsed" href="#collapse` + id(learningOutcome["Title"]) + `">... ` + learningOutcome["Title"] + `</a>
        </h3>
      </div>
    </div>`);
}

function formatLOPanelBody(learningOutcome) {
  return $(`<div id="collapse` + id(learningOutcome["Title"]) + `" class="panel-collapse learningOutcome collapse">
</div>`);
}

function formatLOPanelBodyContent(learningOutcome) {
  return $(`<div class="goal panel-body"><p>` + learningOutcome["Description"] + `<br />
         <strong>Bloom level: ` + learningOutcome["Bloom level"] + `</strong></p>
         <h4>Teaching activities</h4>
  </div>`);
}

/* Format a teachingActivity */
function formatTA(ta) {
  return $(`
    <li class="teachingActivity ` + id(ta['Title']) + `" id="` + id(ta['Title'] + ta['Description']) + `">
    <strong>` + ta['Title'] + `</strong>:
    ` + ta['Description'] + `
    </li>`);
}

/* Format an assessment method */
function formatAssessment(assessments, assessmenttyp) {
	as = $('')
	if (assessments.length > 0) {
		aslist = $('<ul></ul>')
		$.each(assessments,
		  function(l, assessment) {
			aslist.append(`<li><strong>` + assessment["Assessment method"] + `</strong>: ` + assessment["Assessment method description"] + `</li>`)
		});

		as = $('<div class="assessment"><h4>' + assessmenttyp + ' assessment</h4></div>')
		as.append(aslist)
	}
	return as;
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

/* Add a list of Bodies of Knowlege Links*/
function addBokList(bokList, type="short") {
	list = $(`<ul class="bok ` + type + `"></ul>`);
	bokList.forEach(function(bokItem) {
		if (type == "list") {
			list.append(`<li><a href="` + bokItem["URL"] + `" title="` + bokItem["Topic"] + `" target="_blank"><strong>` + bokItem["Source"] + `</strong>: ` + bokItem["Topic"] + `</a></li>`);
		} else {
			list.append(`<li><a href="` + bokItem["URL"] + `" title="` + bokItem["Topic"] + `" target="_blank">` + bokItem["Source"] + `</a></li>`);
		}
	});
	return list;
}

/* Remove blanks and punctuation from a string so we can use it as ID for a node in the HTML tree */
function id(st) {
  return st.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
}

/* Add a button at the top of the page that works as a direct link to the topic */
function addTopicButton(topic) {
  $('#topic-buttons').append(`<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown"
     href="#` + id(topic) + `" role="button" aria-haspopup="true" aria-expanded="false">` + topic + `</a>
    <ul class="dropdown-menu" id="dropdown-` + id(topic) + `" aria-labelledby="navbarScrollingDropdown">
      <li><a class="dropdown-item" href="#` + id(topic) + `"><strong>Overview</strong></a></li>
    </ul>
    </li>`);
}

/* Add an entry to the dropdown menu below the topic button */
function addDropdownConceptToTopic(topic, concept){
  $('ul#dropdown-' + id(topic)).append('<li><a class="dropdown-item" href="#' + id(concept) + '">'+concept+'</a></li>')

}

function addShortMenuTopic (topic) {
	$("div#shortmen").append(`
		<a href="#` + id(topic) + `">
			<div class="ban ` + id(topic) + `">
				<strong>` + topic + `.</strong>
				<br><span class="conceptcounter ` + id(topic) + `"></span> concepts
			</div>
		</a>`)
}

function addPermalink (topic, description = false) {
	url =  window.location.protocol + "//" + window.location.host + "/toolkit/#" + id(topic);
	perma = $(`<a class="permalink" href="` + url + `" title="Permalink"></a>`);
	if (description) {
		perma.addClass('detail');
	}

	return perma;
}

/* Read in the toolkit data in JSON format and insert into the page */
$.getJSON("toolkit.json", function(data) {

  // keep track of all kinds of teaching activities
  // and bloom levels found in the Data
  // so we can add them to the selection menues later
  activities = []
  blooms = []

  //strukture documentation to un-collapse by hash
  hashStrukture = {}

  $.each(data["Topics"],
    function(i, topics) {

      // loop through all the topics
      $.each(topics, function(topic, topicContent) {

		// add topic to ShortMenu
		addShortMenuTopic(topic)

        // format the topic. Everything else will be appended to this one.
        ft = formatTopic(topic)
        addTopicButton(topic)

        // loop through concepts in this topic
        $.each(topicContent["Concepts"],
          function(c, conceptContent) {

            // add title and description for each concept
            fc = formatConcept(conceptContent)

			lol = formatLOList(conceptContent)

            // add an item in the dropdown menu under the topic area:
            addDropdownConceptToTopic(topic, conceptContent["Title"])

            $.each(conceptContent["Learning outcomes"],
              function(l, learningOutcome) {


                //keep track of all bloom levels used in the data
                // so we can list them in the drop down selection
                // menu at the end; ignore the empty ones

                if (!blooms.includes(learningOutcome["Bloom level"]) && learningOutcome["Bloom level"] != "") {
                  blooms.push(learningOutcome["Bloom level"])
                }

				//track strukure
				hashStrukture[id(learningOutcome["Title"])] = id(conceptContent["Title"])

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

				//seperate formative and summative assessments
				afor = learningOutcome["Assessment"].filter(assessment => assessment["Assessment method type"] == "Formative")
				asum = learningOutcome["Assessment"].filter(assessment => assessment["Assessment method type"] == "Summative")

				lopbc.append(formatAssessment(afor, "Formative"))
				lopbc.append(formatAssessment(asum, "Summative"))

				// BoK from concept added in BoK List of LO
				bok = [];
				if (learningOutcome["BoK"]) {
					bok = bok.concat(learningOutcome["BoK"])
				}
				if (conceptContent["BoK"]) {
					bok = bok.concat(conceptContent["BoK"])
				}

				// BoK's to the body content, if existing:
				if (bok.length > 0) {
					lopbc.append('<h4>See also</h5>')
					lopbc.append(addBokList(bok, "list"))
				};

                // … panel body content to panel body
                lopb = formatLOPanelBody(learningOutcome)
				lopb.append(addPermalink(learningOutcome["Title"]))
                lopb.append(lopbc)

                // panel body to panel header
                loph = formatLOPanelHeader(learningOutcome)
                loph.append(lopb)

                // attach the whole learning objective to the concept
                lol.append(loph)
              });

			// Add Permalink with description
			lol.append(addPermalink(conceptContent["Title"], true))

			// BoK to the concept content, if existing:
			if (conceptContent["BoK"]) {
				lol.append(addBokList(conceptContent["BoK"]))
			};

			// lO List to concept content
			fc.append(lol)
			fc.append(formatLOListLink(conceptContent))

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

  $("#resetter").on("click", resetSearchForm);

  //change no-print as Concept if open/closed
  $("div.concept").on("click", "a.collapseLO", function(){
	$(this).parent().toggleClass('no-print');
  })

  //read URL hash and open Concept
  if (window.location.hash) {
	 hash = window.location.hash.substring(1)

	// if hash = LO  open Concept and LO
	if (hashStrukture[hash]) {
		//open Concept
		$("div#collapse" + hashStrukture[hash]).addClass('show');
		$("div#collapse" + hashStrukture[hash] + " + a").removeClass('collapsed');
		//open LO
		$("div#collapse" + hash).addClass('show');
		$('a[href*="#collapse' + hash + '"]').removeClass('collapsed')
		//delete class no-print
		$("#"+ hashStrukture[hash]).closest("div.concept").removeClass('no-print');

	// if hash = Concept open Concept
	}else if (Object.values(hashStrukture).includes(hash)) {
		$("div#collapse" + hash).addClass('show');
		$("div#collapse" + hash + " + a").removeClass('collapsed');
		//delete class no-print
		$("#"+ hash).closest("div.concept").removeClass('no-print');
	}
  }

  console.log("ready")
    $(".dropdown-toggle").dropdown();
});
