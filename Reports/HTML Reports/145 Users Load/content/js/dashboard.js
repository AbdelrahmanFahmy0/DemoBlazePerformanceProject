/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.99188094213548, "KoPercent": 0.0081190578645254};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7351156284212091, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.016594516594516596, 500, 1500, "Place Order"], "isController": true}, {"data": [0.760600335852225, 500, 1500, "Place Order-5"], "isController": false}, {"data": [0.887384550797649, 500, 1500, "Place Order-4"], "isController": false}, {"data": [0.8423262649590594, 500, 1500, "Place Order-7"], "isController": false}, {"data": [0.8951511335012594, 500, 1500, "Place Order-6"], "isController": false}, {"data": [0.05519215044971382, 500, 1500, "View Product"], "isController": true}, {"data": [0.859925788497217, 500, 1500, "Place Order-1"], "isController": false}, {"data": [0.7454888795635753, 500, 1500, "Place Order-3"], "isController": false}, {"data": [0.6746697420842944, 500, 1500, "Place Order-2"], "isController": false}, {"data": [0.8980364082634485, 500, 1500, "View Product-4"], "isController": false}, {"data": [0.7736099754701553, 500, 1500, "View Product-3"], "isController": false}, {"data": [0.8996320523303353, 500, 1500, "View Product-2"], "isController": false}, {"data": [0.8912510220768601, 500, 1500, "View Product-1"], "isController": false}, {"data": [0.041379310344827586, 500, 1500, "Open Browser"], "isController": true}, {"data": [0.8758620689655172, 500, 1500, "Login-1"], "isController": false}, {"data": [0.47586206896551725, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.8482758620689655, 500, 1500, "Login-2"], "isController": false}, {"data": [0.8700431477296076, 500, 1500, "View Product-6"], "isController": false}, {"data": [0.9103448275862069, 500, 1500, "Login-3"], "isController": false}, {"data": [0.8305276123999179, 500, 1500, "View Product-5"], "isController": false}, {"data": [0.8827586206896552, 500, 1500, "Login-4"], "isController": false}, {"data": [0.7413793103448276, 500, 1500, "Login-5"], "isController": false}, {"data": [0.8931034482758621, 500, 1500, "Login-6"], "isController": false}, {"data": [0.7620689655172413, 500, 1500, "Login-7"], "isController": false}, {"data": [0.4413793103448276, 500, 1500, "Open Browser-1"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "Open Browser-2"], "isController": false}, {"data": [0.47586206896551725, 500, 1500, "Logout"], "isController": true}, {"data": [0.4, 500, 1500, "Open Browser-3"], "isController": false}, {"data": [0.8984776794898169, 500, 1500, "View Cart-1"], "isController": false}, {"data": [6.171569635877391E-4, 500, 1500, "View Cart"], "isController": true}, {"data": [0.8261180314478253, 500, 1500, "View Category-2"], "isController": false}, {"data": [0.857463295269168, 500, 1500, "View Category-1"], "isController": false}, {"data": [0.8479604449938195, 500, 1500, "View Cart-8"], "isController": false}, {"data": [0.8653212520593081, 500, 1500, "View Cart-7"], "isController": false}, {"data": [0.8475396335186329, 500, 1500, "View Cart-6"], "isController": false}, {"data": [0.48519736842105265, 500, 1500, "Add to Cart"], "isController": true}, {"data": [0.8206051873198847, 500, 1500, "View Cart-5"], "isController": false}, {"data": [0.9052274130479523, 500, 1500, "View Cart-4"], "isController": false}, {"data": [0.7648148148148148, 500, 1500, "View Cart-3"], "isController": false}, {"data": [0.9021604938271605, 500, 1500, "View Cart-2"], "isController": false}, {"data": [0.013793103448275862, 500, 1500, "Login"], "isController": true}, {"data": [0.8490953947368421, 500, 1500, "Add to Cart-1"], "isController": false}, {"data": [0.8286037425457536, 500, 1500, "Add to Cart-2"], "isController": false}, {"data": [0.5092781402936378, 500, 1500, "View Category"], "isController": true}, {"data": [0.8103448275862069, 500, 1500, "Register-2"], "isController": false}, {"data": [0.5896551724137931, 500, 1500, "Register"], "isController": true}, {"data": [0.9275862068965517, 500, 1500, "Register-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 123167, 10, 0.0081190578645254, 458.62033661613884, 72, 23672, 309.0, 853.0, 1035.9500000000007, 2084.0, 98.65545922323253, 137.40897600466096, 62.60732944833459], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Place Order", 4851, 3, 0.06184291898577613, 3604.10245310245, 191, 27617, 3178.0, 5699.8, 6851.199999999999, 9427.039999999957, 4.142358454475899, 40.83358109199307, 18.10271779830788], "isController": true}, {"data": ["Place Order-5", 4764, 0, 0.0, 529.9342989084817, 183, 11966, 417.0, 905.0, 1025.75, 2299.0000000000073, 4.136612406190331, 1.813872032887979, 2.254130588529497], "isController": false}, {"data": ["Place Order-4", 4764, 0, 0.0, 326.0012594458443, 73, 6035, 194.0, 710.0, 823.0, 1444.7000000000007, 4.135603343206464, 2.198212560375989, 2.6736029425807413], "isController": false}, {"data": ["Place Order-7", 4763, 1, 0.020995171110644553, 466.4310308629009, 194, 23213, 325.0, 885.6000000000004, 995.0, 1634.7999999999984, 4.136832487380186, 2.497605727044184, 2.8232800807346763], "isController": false}, {"data": ["Place Order-6", 4764, 0, 0.0, 408.5004198152819, 200, 6021, 314.0, 726.0, 945.0, 1567.050000000001, 4.136353809326592, 6.262105844672708, 2.439802442219982], "isController": false}, {"data": ["View Product", 4892, 2, 0.04088307440719542, 2472.150654129191, 589, 26629, 2246.0, 3560.7, 4261.199999999993, 6705.349999999969, 4.1442630505740725, 46.39546368205107, 15.856417847101092], "isController": true}, {"data": ["Place Order-1", 4851, 1, 0.02061430632859204, 434.1937744794882, 183, 23672, 305.0, 839.0, 967.0, 1556.4799999999996, 4.142358454475899, 1.8189388854293334, 2.2770186072034857], "isController": false}, {"data": ["Place Order-3", 4766, 1, 0.0209819555182543, 642.6777171632384, 81, 11990, 314.0, 1710.6000000000004, 2271.2999999999993, 3801.859999999997, 4.131901819215858, 25.58211511423417, 3.114413004003593], "isController": false}, {"data": ["Place Order-2", 4769, 0, 0.0, 819.6703711469909, 206, 10728, 527.0, 1793.0, 2468.5, 4556.900000000001, 4.133456294051775, 1.275606177779357, 2.7771659475660364], "isController": false}, {"data": ["View Product-4", 4889, 0, 0.0, 389.9097975046019, 185, 12110, 286.0, 718.0, 919.0, 1572.1000000000004, 4.147163659004579, 1.8184605735814054, 2.259880196996636], "isController": false}, {"data": ["View Product-3", 4892, 0, 0.0, 520.0758381030247, 184, 11995, 373.0, 913.6999999999998, 1051.3499999999995, 1817.189999999995, 4.1460332581024355, 1.8179880699842277, 2.2552153562139226], "isController": false}, {"data": ["View Product-2", 4892, 1, 0.02044153720359771, 304.82686017988436, 72, 23382, 146.5, 704.0, 814.0, 1429.5599999999977, 4.148262215623142, 2.2066576635370976, 2.705539762729916], "isController": false}, {"data": ["View Product-1", 4892, 1, 0.02044153720359771, 344.7162714636138, 80, 23471, 212.0, 739.3999999999996, 992.3999999999978, 1999.679999999993, 4.148547160467025, 35.13628658758675, 3.1553297120291752], "isController": false}, {"data": ["Open Browser", 145, 0, 0.0, 3933.172413793104, 1051, 12437, 3224.0, 6748.8, 8117.999999999998, 12206.079999999996, 2.273653840122934, 18.676378819150436, 4.582833521497789], "isController": true}, {"data": ["Login-1", 145, 0, 0.0, 383.57241379310335, 192, 2946, 251.0, 832.2, 916.6999999999998, 2269.3399999999883, 2.2234489526788725, 0.9749302536648573, 1.2116059722605577], "isController": false}, {"data": ["Logout-1", 145, 0, 0.0, 1279.5034482758617, 389, 15857, 997.0, 2111.8, 2415.4, 10164.039999999903, 3.416668630269328, 5.187753857006527, 2.015300637385424], "isController": false}, {"data": ["Login-2", 145, 0, 0.0, 449.4344827586208, 230, 1736, 315.0, 893.8, 996.1999999999992, 1688.1599999999992, 2.036173678593496, 1.1249832147320675, 1.4016110127155534], "isController": false}, {"data": ["View Product-6", 4867, 0, 0.0, 428.3182658722008, 193, 6191, 314.0, 843.0, 981.5999999999995, 1603.719999999994, 4.1437357817161375, 2.5026276487407024, 2.828585265058184], "isController": false}, {"data": ["Login-3", 145, 0, 0.0, 277.84137931034496, 83, 1605, 129.0, 765.4000000000003, 890.8999999999994, 1547.039999999999, 2.0235005163415107, 12.531775281545675, 1.5788837036688157], "isController": false}, {"data": ["View Product-5", 4871, 0, 0.0, 481.4721823034286, 193, 6542, 332.0, 906.8000000000002, 1100.199999999999, 2034.7999999999975, 4.145803597342123, 2.9813913536780707, 2.6882945201515334], "isController": false}, {"data": ["Login-4", 145, 0, 0.0, 347.42068965517274, 75, 2938, 188.0, 792.4, 1307.5, 2247.079999999988, 2.003398869806707, 1.0618364820661261, 1.2951660662226951], "isController": false}, {"data": ["Login-5", 145, 0, 0.0, 644.4896551724136, 194, 8470, 364.0, 902.6000000000001, 1534.7999999999997, 8375.699999999999, 2.0001655309404915, 0.8771334739771567, 1.0899339514304631], "isController": false}, {"data": ["Login-6", 145, 0, 0.0, 405.4068965517242, 217, 2914, 273.0, 847.8, 1074.9999999999977, 2298.0599999999895, 1.9900087834870446, 3.0285848249821585, 1.1737942433849362], "isController": false}, {"data": ["Login-7", 145, 1, 0.6896551724137931, 511.1379310344827, 208, 2893, 321.0, 891.0, 995.5, 2283.9599999999896, 1.992113976396884, 1.2061359257147566, 1.3598512397474822], "isController": false}, {"data": ["Open Browser-1", 145, 0, 0.0, 1651.1517241379313, 287, 7592, 941.0, 4460.4, 4578.0, 7583.26, 2.305979643765903, 14.248991133905852, 1.7970427302003815], "isController": false}, {"data": ["Open Browser-2", 145, 0, 0.0, 464.5172413793103, 75, 10156, 290.0, 820.2, 1315.7, 6220.699999999932, 2.3630259769890163, 1.267643757537238, 1.5276593718425084], "isController": false}, {"data": ["Logout", 145, 0, 0.0, 1279.5034482758617, 389, 15857, 997.0, 2111.8, 2415.4, 10164.039999999903, 3.3753113433739146, 5.12495835418655, 1.9909063001932072], "isController": true}, {"data": ["Open Browser-3", 145, 0, 0.0, 1817.5034482758626, 425, 7715, 1138.0, 4519.2, 4599.499999999999, 7596.319999999998, 2.352406755463262, 3.5254573251107253, 1.3875524221677833], "isController": false}, {"data": ["View Cart-1", 4861, 0, 0.0, 312.0752931495581, 81, 5760, 203.0, 718.0, 866.7999999999993, 1637.4600000000019, 4.146195837598089, 29.933821314717672, 3.1501370719251107], "isController": false}, {"data": ["View Cart", 4861, 3, 0.061715696358773914, 3358.957827607482, 382, 26821, 3137.0, 4580.200000000001, 5349.799999999996, 8127.360000000002, 4.141864614451282, 45.502163773585025, 20.978692251087654], "isController": true}, {"data": ["View Category-2", 4897, 0, 0.0, 489.98672656728706, 201, 7635, 342.0, 908.1999999999998, 1080.7999999999956, 2167.299999999993, 4.147423676648319, 5.386596980435035, 2.716747906808737], "isController": false}, {"data": ["View Category-1", 4904, 0, 0.0, 433.3419657422511, 183, 11937, 305.0, 838.0, 978.0, 1598.9499999999998, 4.148826459089983, 1.8192127350106302, 2.260786293136924], "isController": false}, {"data": ["View Cart-8", 4854, 0, 0.0, 451.99361351462784, 195, 8094, 323.0, 875.0, 987.75, 1584.8999999999996, 4.147622550967308, 2.9859159725657927, 2.6773227599505773], "isController": false}, {"data": ["View Cart-7", 4856, 0, 0.0, 424.51297364085764, 184, 11859, 304.0, 842.0, 976.0, 1567.300000000003, 4.146883005977797, 1.818361042912041, 2.255677572587532], "isController": false}, {"data": ["View Cart-6", 4857, 1, 0.020588840848260244, 474.1747992588015, 206, 23228, 343.0, 875.0, 1009.2999999999984, 1657.7800000000007, 4.147896375180942, 2.4697580914189703, 2.8956399370599213], "isController": false}, {"data": ["Add to Cart", 4864, 1, 0.02055921052631579, 943.8094161184204, 422, 24921, 815.5, 1375.0, 1841.5, 2921.700000000008, 4.1402298576625745, 3.058864364646233, 5.396377838853639], "isController": true}, {"data": ["View Cart-5", 4858, 0, 0.0, 481.0578427336347, 196, 11651, 336.0, 914.0, 1006.1000000000004, 1639.4099999999999, 4.147914388003323, 2.5093171382272406, 2.831437653529612], "isController": false}, {"data": ["View Cart-4", 4859, 0, 0.0, 379.4513274336279, 183, 6247, 287.0, 679.0, 913.0, 1557.199999999999, 4.14779076149819, 1.8187757249564007, 2.2602219188632713], "isController": false}, {"data": ["View Cart-3", 4860, 2, 0.0411522633744856, 537.0969135802485, 184, 23471, 395.5, 917.0, 1032.9499999999998, 1933.960000000021, 4.143586350719628, 1.8217712211728738, 2.2691360713046413], "isController": false}, {"data": ["View Cart-2", 4860, 0, 0.0, 300.69506172839505, 73, 11023, 139.0, 705.0, 818.9499999999998, 1423.7800000000007, 4.14617042296057, 2.206269639123213, 2.6763853999774776], "isController": false}, {"data": ["Login", 145, 1, 0.6896551724137931, 3019.303448275862, 1398, 11095, 2816.0, 4009.0, 4684.0, 10993.799999999997, 2.1304731119600353, 21.901243502975316, 9.539018306457537], "isController": true}, {"data": ["Add to Cart-1", 4864, 0, 0.0, 439.76562500000045, 185, 5919, 310.0, 852.5, 1013.0, 1612.7000000000007, 4.14023338182332, 1.8154352011766977, 2.2722765240085017], "isController": false}, {"data": ["Add to Cart-2", 4863, 1, 0.02056343820686819, 504.1474398519428, 218, 23083, 355.0, 932.0, 1065.2000000000007, 1710.3599999999997, 4.142403974254571, 1.2443394852000416, 3.126386537804654], "isController": false}, {"data": ["View Category", 4904, 0, 0.0, 926.8835644371934, 207, 12222, 755.0, 1499.5, 1877.0, 3310.8499999999995, 4.1451793271860025, 7.193610869388815, 4.970200844461951], "isController": true}, {"data": ["Register-2", 145, 0, 0.0, 500.15862068965515, 230, 2928, 339.0, 949.4, 1422.7999999999956, 2348.39999999999, 2.205390278031271, 0.6504772483573644, 1.5202458629920301], "isController": false}, {"data": ["Register", 145, 0, 0.0, 836.9241379310347, 433, 3549, 603.0, 1435.0000000000002, 1791.1999999999998, 3535.66, 2.356420840510937, 1.728322324852927, 2.910722501990769], "isController": true}, {"data": ["Register-1", 145, 0, 0.0, 336.76551724137937, 188, 3287, 213.0, 530.6000000000001, 1090.8999999999978, 3177.979999999998, 2.365724727533773, 1.0373785781586504, 1.2914454323157998], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, 60.0, 0.00487143471871524], "isController": false}, {"data": ["502/Bad Gateway", 1, 10.0, 8.1190578645254E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 2, 20.0, 0.00162381157290508], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, 10.0, 8.1190578645254E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 123167, 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 2, "502/Bad Gateway", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Place Order-7", 4763, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Place Order-1", 4851, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Place Order-3", 4766, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Product-2", 4892, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["View Product-1", 4892, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login-7", 145, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart-6", 4857, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart-3", 4860, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add to Cart-2", 4863, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
