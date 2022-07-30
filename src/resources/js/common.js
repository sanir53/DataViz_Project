// Parameter Selection
const month = [
  "Totals",
  "0-9",
  "10-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-79",
  "80+",
  "Unknown",
];

const det_date = [
  "2020-11-30",
  "2020-12-31",
  "2021-01-31",
  "2021-02-28",
  "2021-03-31",
  "2021-04-30",
  "2021-05-31",
  "2021-06-30",
];

const g = (v) => [].concat(v).map((d) => d);

setButton = (page_no) => {
  // Next Button
  var pn = (Number(page_no) % 12) + 1;
  var url = "./Page_" + pn.toString() + ".html";
  var btnText = page_no == "12" ? "\u21BA" : "\u00BB";
  var btnTitle = page_no == "12" ? "Restart" : "Next";

  div = d3.select("#btn");
  div
    .append("a")
    .attr("href", url)
    .append("input")
    .attr("type", "button")
    .attr("class", "btn btn-outline-secondary")
    .attr("value", btnText)
    .attr("title", btnTitle);

  // Previous
  pn = Number(page_no) - 1;

  url = "./Page_" + pn.toString() + ".html";
  btnText = page_no == "1" ? "\u2302" : "\u00AB";
  btnTitle = page_no == "1" ? "Start" : "Previous";
  div = d3.select("#btn_prev");
  if (pn != 0) {
    div
      .append("a")
      .attr("href", url)
      .append("input")
      .attr("type", "button")
      .attr("class", "btn btn-outline-secondary")
      .attr("value", btnText)
      .attr("title", btnTitle);
  }
};

setNav = (page_no) => {
  var nav = d3
    .select("#page_nav")
    .append("nav")
    .attr("aria-label", "Page No.")
    .append("ul")
    .attr("class", "pagination pagination-sm")
    .attr("title", "Page No.");

  for (i = 1; i < 13; i++) {
    li = nav.append("li");
    if (i.toString() == page_no) {
      li.attr("aria-current", "page");
      li.attr("class", "page-item active");
    } else {
      li.attr("class", "page-item disabled");
    }
    li.append("span").attr("class", "page-link").text(i.toString());
  }
};

setParameter = (page_no) => {
  var tmp = "";
  d3.select("#message")
    .append("span")
    .attr("class", "fs-4")
    .text(
      "Vaccination has helped to reduce overall Covid Cases and Deaths in Maryland across all Age Groups"
    );
  var param = "";
  switch (page_no) {
    case "n":
      param = { chart_file: "../resources/data/summary_data_all.csv" };
      break;
    case "1":
      param = { chart_file: "../resources/data/details_by_age.csv" };
      d3.select("#chart_header")
        .append("span")
        .attr("class", "fs-4")
        .text("Totals of Covid-19 Case, Death and Vaccination by Age Groups");
      d3.select("#chart_header")
        .append("p")
        .text(
          "The below chart shows the totals of Cases, Deaths and Vaccination from March 2020 to June 2021 by Age Groups."
        );
      d3.select("#chart_footer")
        .append("p")
        .text(
          "The above chart plots totals of Cases, Deaths and Vaccinations by " +
            "Age Group. The vertical axis plots the counts in Logarithmic " +
            "Scale while the horizontal axis plots three measures of Cases, " +
            "Deaths and Vaccinations by Age Group."
        );
      d3.select("#chart_footer")
        .append("p")
        .append("em")
        .text(
          "The tooltip shows the details of each measures for the particular Age Group."
        );
      break;
    default:
      param = { chart_file: "../resources/data/details_data_by_month.csv" };
      const x = () => {
        tmp = g(month[Number(page_no) - 1]);
        return (
          "Covid-19 Case, Death and Vaccination Totals for Age Group " +
          tmp +
          " by Month"
        );
      };
      d3.select("#chart_header").append("span").attr("class", "fs-4").text(x());
      d3.select("#chart_header")
        .append("p")
        .text(
          "The below chart shows the month-to-month change of Cases, Deaths and Vaccination for the age group from November 2020 to June 2021."
        );
      d3.select("#chart_footer")
        .append("p")
        .text(
          "The above chart plots totals of Cases, Deaths and Vaccinations by " +
            "Age Group. The vertical axis plots the counts in Logarithmic Scale " +
            "while the horizontal axis plots months."
        );
      cf =
        "The tooltip shows the details of the three measures for the selected month. ";

      ef = "The dropdown can be used to filer the chart.";

      if (page_no != 12) {
        d3.select("#chart_footer").append("p").append("em").text(cf);
      } else {
        d3.select("#chart_footer")
          .append("p")
          .append("em")
          .text(cf)
          .append("mark")
          .text(ef);
      }

      break;
  }
  //console.log(param);

  return param;
};

var parseNumber = d3.format(".2f");
var parseTime = d3.timeParse("%Y-%m-%d");
function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

loadAgeDDL = (page_no) => {
  var q = month;
  const ddl = d3
    .select("#ddlContainer")
    .insert("select", "svg")
    .attr("class", "form-select form-select-sm")
    .attr("title", "Selected Age Group");

  if (page_no != "12") {
    ddl.property("disabled", true);
    q = g(month[Number(page_no) - 1]);
  }
  //console.log(q)
  ddl
    .selectAll("option")
    .data(q)
    .enter()
    .append("option")
    .attr("value", function (d) {
      return d;
    })
    .text(function (d) {
      return "Age Group : " + d;
    });
  return page_no == "12" ? "Totals" : month[Number(page_no) - 1];
};

setDetailsBtn = () => {
  div = d3.select("#det_btn");
  div
    .append("button")
    .attr("type", "button")
    .attr("class", "btn btn-outline-primary btn-sm")
    .text("Click for More Details")
    .attr("title", "Daily Details for the selected Age Group")
    .attr("data-toggle", "modal")
    .attr("data-target", "#exampleModal");
};

loadmodal = () => {
  d3.select("#exampleModalLabel").text(function () {
    return "Daily Details for for Age Group: " + index;
  });
  var ddl2 = d3
    .select("#detail_month")
    .insert("select", "svg")
    .attr("class", "form-select form-select-sm")
    .attr("title", "Selected Month");

  ddl2
    .selectAll("option")
    .data(det_date)
    .enter()
    .append("option")
    .attr("value", function (d) {
      return d;
    })
    .text(function (d) {
      var dt = new Date(d);
      return (
        dt.getFullYear() +
        " - " +
        dt.toLocaleString("default", { month: "long" })
      );
    });

  return { start: "2020-11-01", end: "2020-11-30" };
};
