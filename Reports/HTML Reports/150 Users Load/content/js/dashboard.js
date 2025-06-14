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

    var data = {"OkPercent": 99.98890658552627, "KoPercent": 0.011093414473736341};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.73465511100558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.012595727529222087, 500, 1500, "Place Order"], "isController": true}, {"data": [0.7794929462277653, 500, 1500, "Place Order-5"], "isController": false}, {"data": [0.8712183156173344, 500, 1500, "Place Order-4"], "isController": false}, {"data": [0.8452015551463066, 500, 1500, "Place Order-7"], "isController": false}, {"data": [0.8866843935365105, 500, 1500, "Place Order-6"], "isController": false}, {"data": [0.04778972520908005, 500, 1500, "View Product"], "isController": true}, {"data": [0.8517734784361145, 500, 1500, "Place Order-1"], "isController": false}, {"data": [0.7362132352941176, 500, 1500, "Place Order-3"], "isController": false}, {"data": [0.674219228413962, 500, 1500, "Place Order-2"], "isController": false}, {"data": [0.9003189792663477, 500, 1500, "View Product-4"], "isController": false}, {"data": [0.7823705179282868, 500, 1500, "View Product-3"], "isController": false}, {"data": [0.8912783751493429, 500, 1500, "View Product-2"], "isController": false}, {"data": [0.8830147351652728, 500, 1500, "View Product-1"], "isController": false}, {"data": [0.15333333333333332, 500, 1500, "Open Browser"], "isController": true}, {"data": [0.89, 500, 1500, "Login-1"], "isController": false}, {"data": [0.55, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.8166666666666667, 500, 1500, "Login-2"], "isController": false}, {"data": [0.8636272343844146, 500, 1500, "View Product-6"], "isController": false}, {"data": [0.9433333333333334, 500, 1500, "Login-3"], "isController": false}, {"data": [0.829084704937776, 500, 1500, "View Product-5"], "isController": false}, {"data": [0.92, 500, 1500, "Login-4"], "isController": false}, {"data": [0.7966666666666666, 500, 1500, "Login-5"], "isController": false}, {"data": [0.9033333333333333, 500, 1500, "Login-6"], "isController": false}, {"data": [0.8233333333333334, 500, 1500, "Login-7"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "Open Browser-1"], "isController": false}, {"data": [0.9266666666666666, 500, 1500, "Open Browser-2"], "isController": false}, {"data": [0.55, 500, 1500, "Logout"], "isController": true}, {"data": [0.5033333333333333, 500, 1500, "Open Browser-3"], "isController": false}, {"data": [0.8913480885311871, 500, 1500, "View Cart-1"], "isController": false}, {"data": [1.0060362173038229E-4, 500, 1500, "View Cart"], "isController": true}, {"data": [0.8282898666135775, 500, 1500, "View Category-2"], "isController": false}, {"data": [0.856120826709062, 500, 1500, "View Category-1"], "isController": false}, {"data": [0.854955680902498, 500, 1500, "View Cart-8"], "isController": false}, {"data": [0.8645791381393476, 500, 1500, "View Cart-7"], "isController": false}, {"data": [0.8416230366492147, 500, 1500, "View Cart-6"], "isController": false}, {"data": [0.4886477797870203, 500, 1500, "Add to Cart"], "isController": true}, {"data": [0.8313871552244816, 500, 1500, "View Cart-5"], "isController": false}, {"data": [0.9016508959130259, 500, 1500, "View Cart-4"], "isController": false}, {"data": [0.7747031595894546, 500, 1500, "View Cart-3"], "isController": false}, {"data": [0.8898390342052314, 500, 1500, "View Cart-2"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "Login"], "isController": true}, {"data": [0.858147478400643, 500, 1500, "Add to Cart-1"], "isController": false}, {"data": [0.831087874522421, 500, 1500, "Add to Cart-2"], "isController": false}, {"data": [0.49970190779014306, 500, 1500, "View Category"], "isController": true}, {"data": [0.8533333333333334, 500, 1500, "Register-2"], "isController": false}, {"data": [0.6966666666666667, 500, 1500, "Register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "Register-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 126201, 14, 0.011093414473736341, 467.60956727759753, 73, 66823, 326.0, 878.0, 1172.0, 2804.970000000005, 100.25205805040684, 137.9745035745295, 63.64751642413791], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Place Order", 4962, 2, 0.04030632809351068, 3713.895002015329, 198, 76868, 3258.5, 5803.4, 6922.4999999999945, 9638.59, 4.21959945269363, 41.37275172739321, 18.50193387014102], "isController": true}, {"data": ["Place Order-5", 4891, 0, 0.0, 516.3886730729915, 185, 4912, 381.0, 926.8000000000002, 1034.0, 1874.2399999999961, 4.238474183957232, 1.8585155967682394, 2.30963729946107], "isController": false}, {"data": ["Place Order-4", 4892, 0, 0.0, 350.68070318888, 73, 11737, 194.0, 724.6999999999998, 926.3499999999995, 1513.1399999999994, 4.24061227090335, 2.2530834604527366, 2.7414895735722826], "isController": false}, {"data": ["Place Order-7", 4887, 0, 0.0, 465.56374053611586, 196, 8385, 334.0, 877.1999999999998, 1029.7999999999984, 1646.7199999999993, 4.223143031209088, 2.560784611441892, 2.8827900183741724], "isController": false}, {"data": ["Place Order-6", 4889, 0, 0.0, 421.2405399877277, 201, 6344, 320.0, 780.0, 960.0, 1588.2000000000007, 4.238305648675757, 6.409005543433313, 2.499938097461091], "isController": false}, {"data": ["View Product", 5022, 5, 0.09956192751891677, 2553.0465949820773, 672, 32349, 2306.5, 3687.0, 4469.549999999998, 6851.409999999984, 4.260336958550366, 49.66353504126088, 16.277646101795924], "isController": true}, {"data": ["Place Order-1", 4962, 2, 0.04030632809351068, 447.2267230955258, 184, 23120, 316.0, 838.0, 985.0, 1596.1099999999997, 4.255147639559324, 1.870696655545713, 2.338557151640873], "isController": false}, {"data": ["Place Order-3", 4896, 0, 0.0, 690.1950571895413, 81, 66823, 364.0, 1683.3000000000002, 2280.0, 4126.0599999999995, 4.239805329199754, 25.856660714904265, 3.196415736467002], "isController": false}, {"data": ["Place Order-2", 4899, 0, 0.0, 814.2927127985329, 222, 16436, 535.0, 1715.0, 2435.0, 3847.0, 4.203861992505301, 1.2973425203607136, 2.824469776214499], "isController": false}, {"data": ["View Product-4", 5016, 1, 0.019936204146730464, 397.8309409888363, 184, 23341, 298.0, 777.0, 932.1499999999996, 1563.3199999999997, 4.271931976126237, 1.8754475212830104, 2.3274050935507113], "isController": false}, {"data": ["View Product-3", 5020, 0, 0.0, 520.8830677290835, 183, 11390, 376.0, 922.9000000000005, 1081.9499999999998, 1773.37, 4.261196037936529, 1.8684909593887644, 2.317857610479147], "isController": false}, {"data": ["View Product-2", 5022, 0, 0.0, 319.9790919952214, 73, 9278, 163.0, 714.0, 875.8499999999995, 1528.089999999992, 4.276036823982589, 2.2716063135189857, 2.7894458968948923], "isController": false}, {"data": ["View Product-1", 5022, 1, 0.019912385503783353, 378.6105137395461, 81, 19925, 220.0, 785.0, 1067.0, 2324.16999999999, 4.277176722687859, 38.21165046259429, 3.2531808614120648], "isController": false}, {"data": ["Open Browser", 150, 0, 0.0, 3490.753333333334, 751, 11969, 2478.0, 6701.300000000003, 8901.3, 11803.760000000002, 2.246147856426229, 18.613985218475314, 4.527391773109118], "isController": true}, {"data": ["Login-1", 150, 0, 0.0, 382.94666666666683, 185, 6008, 231.0, 801.2, 818.9, 3504.4100000000444, 2.1768470547259353, 0.9545531023698609, 1.1862115786494842], "isController": false}, {"data": ["Logout-1", 150, 0, 0.0, 1168.2399999999998, 380, 5610, 733.5, 2633.6000000000013, 3439.7, 5041.35000000001, 4.608153359343799, 6.954771454794015, 2.718090458050444], "isController": false}, {"data": ["Login-2", 150, 0, 0.0, 447.3066666666666, 232, 1149, 347.0, 872.9, 924.3499999999999, 1134.7200000000003, 2.0554421256012168, 1.1200955223906162, 1.4149096204968687], "isController": false}, {"data": ["View Product-6", 4979, 0, 0.0, 439.75336412934377, 195, 5214, 328.0, 844.0, 1006.0, 1606.1999999999998, 4.265800769369168, 2.578634871732537, 2.911908923622118], "isController": false}, {"data": ["Login-3", 150, 0, 0.0, 236.26, 81, 1506, 161.0, 688.6, 766.6999999999999, 1189.2900000000056, 2.0522362534374956, 11.816391552995581, 1.6013054360317962], "isController": false}, {"data": ["View Product-5", 4982, 3, 0.060216780409474105, 500.6441188277789, 193, 23213, 340.0, 923.6999999999998, 1172.2499999999973, 2410.8900000000012, 4.254316226689643, 3.0704337324281026, 2.7581044531982517], "isController": false}, {"data": ["Login-4", 150, 0, 0.0, 308.8466666666666, 74, 2894, 169.5, 687.9, 1033.7499999999948, 2151.4400000000132, 2.0355543493011266, 1.0632590921427603, 1.3159540812864703], "isController": false}, {"data": ["Login-5", 150, 0, 0.0, 438.1133333333333, 184, 1678, 357.0, 833.7, 913.6999999999999, 1329.1600000000062, 2.0219720967850643, 0.8865873744692323, 1.1018168261777987], "isController": false}, {"data": ["Login-6", 150, 0, 0.0, 368.4933333333334, 205, 2943, 278.5, 608.1000000000003, 878.1499999999994, 2367.7200000000103, 2.0300171874788537, 3.071484729195707, 1.1973929504269802], "isController": false}, {"data": ["Login-7", 150, 0, 0.0, 453.97999999999996, 198, 4408, 292.0, 820.9, 929.7499999999998, 3644.0200000000136, 1.999946668088851, 1.2062568956494495, 1.3651979697208074], "isController": false}, {"data": ["Open Browser-1", 150, 0, 0.0, 1389.0000000000002, 252, 4749, 680.0, 4370.9, 4486.7, 4689.330000000001, 2.3535687948158723, 14.698175028046695, 1.8341288068975257], "isController": false}, {"data": ["Open Browser-2", 150, 0, 0.0, 287.3, 74, 1541, 203.0, 679.5, 707.3999999999999, 1505.3000000000006, 2.4109166305029173, 1.2838915861018694, 1.5586199310477844], "isController": false}, {"data": ["Logout", 150, 0, 0.0, 1168.2399999999998, 380, 5610, 733.5, 2633.6000000000013, 3439.7, 5041.35000000001, 4.490614615453701, 6.777378248211239, 2.6487609645840196], "isController": true}, {"data": ["Open Browser-3", 150, 0, 0.0, 1814.4533333333336, 384, 10727, 737.0, 4531.3, 4590.3, 9241.370000000026, 2.326014142165984, 3.5110698889715914, 1.3719849041682173], "isController": false}, {"data": ["View Cart-1", 4970, 0, 0.0, 338.33239436619715, 83, 7547, 209.0, 762.9000000000005, 1064.8999999999996, 2029.829999999999, 4.262563627553143, 27.131751683423175, 3.238549318590181], "isController": false}, {"data": ["View Cart", 4970, 5, 0.1006036217303823, 3413.62494969819, 1213, 27300, 3167.0, 4637.0, 5464.249999999999, 8347.459999999994, 4.184364620649881, 42.40023885660342, 21.19476613706109], "isController": true}, {"data": ["View Category-2", 5023, 0, 0.0, 494.89627712522207, 198, 11722, 350.0, 905.0, 1115.2000000000007, 2045.0400000000009, 4.274551652889046, 5.562513775493705, 2.8002414062194174], "isController": false}, {"data": ["View Category-1", 5032, 0, 0.0, 442.03100158982477, 184, 11812, 318.0, 846.0, 1001.3499999999995, 1626.0, 4.269993958196148, 1.8723154757156824, 2.326813113938917], "isController": false}, {"data": ["View Cart-8", 4964, 1, 0.020145044319097503, 456.448025785657, 194, 23565, 328.0, 853.0, 995.5, 1601.0, 4.257852237774114, 3.0692714574330573, 2.7479232020674256], "isController": false}, {"data": ["View Cart-7", 4966, 0, 0.0, 427.9097865485277, 183, 6093, 313.0, 837.0, 981.0, 1602.9799999999996, 4.260828605037662, 1.8683036442053675, 2.31765774707615], "isController": false}, {"data": ["View Cart-6", 4966, 1, 0.02013693113169553, 473.1010873942813, 206, 11662, 346.0, 878.3000000000002, 1014.0, 1637.33, 4.260821293467284, 2.549167612610178, 2.9750851804971763], "isController": false}, {"data": ["Add to Cart", 4977, 1, 0.020092425155716295, 936.9785011050833, 222, 8310, 813.0, 1367.0, 1808.0999999999995, 2723.2200000000003, 4.258650785501592, 3.143508795713968, 5.549465897155337], "isController": true}, {"data": ["View Cart-5", 4967, 0, 0.0, 474.74169518824345, 193, 12234, 335.0, 895.0, 1009.5999999999995, 1634.6399999999994, 4.259526692576572, 2.5716556750024866, 2.9076261309677967], "isController": false}, {"data": ["View Cart-4", 4967, 0, 0.0, 386.57418965170024, 185, 6048, 297.0, 680.3999999999996, 934.0, 1566.9599999999991, 4.259939501483303, 1.8679338819031046, 2.3213342205348466], "isController": false}, {"data": ["View Cart-3", 4969, 1, 0.02012477359629704, 528.931978265243, 183, 23654, 382.0, 927.0, 1063.5, 1722.6000000000004, 4.184544386571394, 1.8371043107059999, 2.2920478182514854], "isController": false}, {"data": ["View Cart-2", 4970, 2, 0.04024144869215292, 329.4871227364179, 73, 23377, 178.0, 714.0, 852.8999999999996, 1499.29, 4.260272657450077, 2.2641136532738093, 2.7489326281167705], "isController": false}, {"data": ["Login", 150, 0, 0.0, 2635.946666666667, 1271, 8071, 2489.5, 3570.0, 4001.95, 7574.260000000009, 2.0493763064773955, 20.121299594906617, 9.175948989315918], "isController": true}, {"data": ["Add to Cart-1", 4977, 0, 0.0, 441.1993168575435, 182, 6108, 315.0, 862.0, 1001.3999999999978, 1625.3200000000015, 4.258650785501592, 1.8673386119917341, 2.3372673256366157], "isController": false}, {"data": ["Add to Cart-2", 4973, 1, 0.020108586366378443, 496.1779609893427, 216, 8049, 364.0, 909.0, 1041.3000000000002, 1676.8200000000015, 4.259525259507273, 1.277458923215055, 3.215442407811642], "isController": false}, {"data": ["View Category", 5032, 0, 0.0, 936.5612082670895, 199, 19087, 763.0, 1512.0, 1868.0, 3241.420000000002, 4.267578530823332, 7.414763318797106, 5.116170026367054], "isController": true}, {"data": ["Register-2", 150, 0, 0.0, 401.16666666666674, 226, 1009, 282.5, 723.0000000000002, 904.1499999999999, 1007.98, 2.1745118220959396, 0.6413111037822009, 1.4989974594453546], "isController": false}, {"data": ["Register", 150, 0, 0.0, 664.6133333333333, 425, 2469, 520.0, 1085.1000000000001, 1244.5499999999995, 2143.620000000006, 2.305457787067919, 1.6908191387578193, 2.847810727679326], "isController": true}, {"data": ["Register-1", 150, 0, 0.0, 263.4466666666667, 187, 1462, 206.0, 351.4000000000001, 642.5499999999968, 1195.2700000000048, 2.341445139940371, 1.0266688162433855, 1.2781912433854175], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, 57.142857142857146, 0.006339093984992195], "isController": false}, {"data": ["502/Bad Gateway", 4, 28.571428571428573, 0.0031695469924960975], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, 7.142857142857143, 7.923867481240244E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException", 1, 7.142857142857143, 7.923867481240244E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 126201, 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8, "502/Bad Gateway", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "Non HTTP response code: java.net.SocketException", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Place Order-1", 4962, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Product-4", 5016, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Product-1", 5022, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Product-5", 4982, 3, "502/Bad Gateway", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart", 8, 1, "Non HTTP response code: java.net.SocketException", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart-8", 4964, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart-6", 4966, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart-3", 4969, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["View Cart-2", 4970, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add to Cart-2", 4973, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
