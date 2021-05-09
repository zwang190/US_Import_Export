import {create_monthly_line_chart} from "./monthly_chart.js";

let default_category_monthly = 'Import';
d3.select('#dropdown_menu_monthly').select("#category_menu_monthly")
    .on('change', function () {
        d3.select("body").select("#dropdown_menu_monthly").select("#monthly_chart").select("svg").remove();
        default_category_monthly = this.value;
        if(default_category_monthly === 'Import'){
            create_monthly_line_chart("monthly_charts/monthly_dataset_import.csv", "#monthly_chart", "i");
        } else {
            create_monthly_line_chart("monthly_charts/monthly_dataset_export.csv", "#monthly_chart", "e");
        }

    });


