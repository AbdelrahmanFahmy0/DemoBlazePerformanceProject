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

    var data = {"OkPercent": 99.99659431477613, "KoPercent": 0.003405685223867042};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7462793049032855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01714203399596658, 500, 1500, "Place Order"], "isController": true}, {"data": [0.7766890903773033, 500, 1500, "Place Order-5"], "isController": false}, {"data": [0.8919274641708101, 500, 1500, "Place Order-4"], "isController": false}, {"data": [0.8208955223880597, 500, 1500, "Place Order-7"], "isController": false}, {"data": [0.9028671737858397, 500, 1500, "Place Order-6"], "isController": false}, {"data": [0.07218410520297312, 500, 1500, "View Product"], "isController": true}, {"data": [0.865888792855085, 500, 1500, "Place Order-1"], "isController": false}, {"data": [0.7633040935672515, 500, 1500, "Place Order-3"], "isController": false}, {"data": [0.6951504528191644, 500, 1500, "Place Order-2"], "isController": false}, {"data": [0.9054092730394963, 500, 1500, "View Product-4"], "isController": false}, {"data": [0.7902718168812589, 500, 1500, "View Product-3"], "isController": false}, {"data": [0.9034610983981693, 500, 1500, "View Product-2"], "isController": false}, {"data": [0.8793596340766152, 500, 1500, "View Product-1"], "isController": false}, {"data": [0.065, 500, 1500, "Open Browser"], "isController": true}, {"data": [0.895, 500, 1500, "Login-1"], "isController": false}, {"data": [0.56, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.87, 500, 1500, "Login-2"], "isController": false}, {"data": [0.8709770114942529, 500, 1500, "View Product-6"], "isController": false}, {"data": [0.88, 500, 1500, "Login-3"], "isController": false}, {"data": [0.8490376328641195, 500, 1500, "View Product-5"], "isController": false}, {"data": [0.905, 500, 1500, "Login-4"], "isController": false}, {"data": [0.775, 500, 1500, "Login-5"], "isController": false}, {"data": [0.89, 500, 1500, "Login-6"], "isController": false}, {"data": [0.69, 500, 1500, "Login-7"], "isController": false}, {"data": [0.465, 500, 1500, "Open Browser-1"], "isController": false}, {"data": [0.855, 500, 1500, "Open Browser-2"], "isController": false}, {"data": [0.56, 500, 1500, "Logout"], "isController": true}, {"data": [0.46, 500, 1500, "Open Browser-3"], "isController": false}, {"data": [0.893843498273878, 500, 1500, "View Cart-1"], "isController": false}, {"data": [0.0011507479861910242, 500, 1500, "View Cart"], "isController": true}, {"data": [0.8428122320663046, 500, 1500, "View Category-2"], "isController": false}, {"data": [0.8710182025028441, 500, 1500, "View Category-1"], "isController": false}, {"data": [0.8488908095649669, 500, 1500, "View Cart-8"], "isController": false}, {"data": [0.8617113223854796, 500, 1500, "View Cart-7"], "isController": false}, {"data": [0.8577188940092166, 500, 1500, "View Cart-6"], "isController": false}, {"data": [0.5408280621046578, 500, 1500, "Add to Cart"], "isController": true}, {"data": [0.8223437949899223, 500, 1500, "View Cart-5"], "isController": false}, {"data": [0.909902130109384, 500, 1500, "View Cart-4"], "isController": false}, {"data": [0.7738129496402878, 500, 1500, "View Cart-3"], "isController": false}, {"data": [0.9047482014388489, 500, 1500, "View Cart-2"], "isController": false}, {"data": [0.02, 500, 1500, "Login"], "isController": true}, {"data": [0.8522139160437032, 500, 1500, "Add to Cart-1"], "isController": false}, {"data": [0.8511647972389992, 500, 1500, "Add to Cart-2"], "isController": false}, {"data": [0.5924345847554039, 500, 1500, "View Category"], "isController": true}, {"data": [0.86, 500, 1500, "Register-2"], "isController": false}, {"data": [0.79, 500, 1500, "Register"], "isController": true}, {"data": [0.97, 500, 1500, "Register-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88088, 3, 0.003405685223867042, 415.7075311052584, 72, 23154, 277.0, 819.0, 915.0, 2016.0, 71.29560383705157, 97.32272085020865, 45.228516377459265], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Place Order", 3471, 0, 0.0, 3329.34312878134, 198, 20437, 2979.0, 5344.000000000001, 6290.999999999998, 8113.039999999983, 2.9781541964861042, 29.25183112831803, 13.049108575428125], "isController": true}, {"data": ["Place Order-5", 3419, 0, 0.0, 474.6165545481134, 183, 6274, 365.0, 852.0, 916.0, 1490.800000000001, 2.9728961260181017, 1.3035826362845493, 1.6199961311700202], "isController": false}, {"data": ["Place Order-4", 3419, 0, 0.0, 307.70459198596103, 72, 4358, 199.0, 701.0, 800.0, 1310.8000000000002, 2.9726428177071784, 1.5801462289321875, 1.9217671341036644], "isController": false}, {"data": ["Place Order-7", 3417, 0, 0.0, 443.5504828797186, 198, 5861, 303.0, 868.0, 940.0, 1481.6400000000003, 2.971960763507766, 1.7955834103793358, 2.028711497746024], "isController": false}, {"data": ["Place Order-6", 3418, 0, 0.0, 364.40140433001693, 201, 3525, 277.0, 647.0999999999999, 870.0499999999997, 1426.6699999999996, 2.9728098358431456, 4.497702946130216, 1.7534933016106056], "isController": false}, {"data": ["View Product", 3498, 1, 0.02858776443682104, 2230.4122355631775, 171, 9281, 2123.0, 3085.3999999999996, 3495.0499999999997, 5310.0199999999995, 2.975291809101603, 33.6453587975564, 11.380137818027904], "isController": true}, {"data": ["Place Order-1", 3471, 0, 0.0, 383.0947853644482, 183, 2401, 275.0, 812.0, 890.0, 1430.0, 2.979038588462684, 1.30625871541513, 1.6378893801801668], "isController": false}, {"data": ["Place Order-3", 3420, 0, 0.0, 585.7736842105254, 81, 7564, 294.5, 1346.8000000000002, 2000.9499999999998, 3635.4799999999996, 2.9722744156699696, 18.217763023743867, 2.240816258688688], "isController": false}, {"data": ["Place Order-2", 3423, 0, 0.0, 782.8030966988032, 226, 7709, 494.0, 1784.0, 2447.7999999999997, 4500.799999999999, 2.9740313111716015, 0.917798020005856, 1.9981772871934198], "isController": false}, {"data": ["View Product-4", 3494, 0, 0.0, 349.21064682312675, 184, 7789, 250.0, 639.0, 850.0, 1164.4500000000053, 2.974310605196446, 1.3042087181393787, 1.620766911816032], "isController": false}, {"data": ["View Product-3", 3495, 0, 0.0, 445.54706723891223, 183, 3962, 338.0, 832.0, 893.0, 1039.2399999999998, 2.974584536926552, 1.3043354715908027, 1.6180113154961813], "isController": false}, {"data": ["View Product-2", 3496, 0, 0.0, 280.23112128146425, 73, 3310, 135.5, 699.0, 720.1499999999996, 1307.0, 2.9746001817433063, 1.58265852524794, 1.9404618373091098], "isController": false}, {"data": ["View Product-1", 3498, 0, 0.0, 350.21497998856535, 80, 5599, 214.0, 808.1999999999998, 895.0499999999997, 2097.329999999992, 2.975952466433332, 25.542239430817187, 2.2639325892105133], "isController": false}, {"data": ["Open Browser", 100, 0, 0.0, 3794.72, 1083, 12297, 2903.0, 6069.7, 8948.1, 12269.839999999986, 2.1798365122615806, 18.193141178474114, 4.393732970027248], "isController": true}, {"data": ["Login-1", 100, 0, 0.0, 350.5799999999998, 191, 1490, 207.0, 818.8, 839.6499999999999, 1489.2599999999995, 2.2119978764820387, 0.969995631304194, 1.205366030348611], "isController": false}, {"data": ["Logout-1", 100, 0, 0.0, 1076.09, 412, 3848, 749.0, 2352.200000000001, 2402.3999999999996, 3844.3399999999983, 3.320824892903397, 5.04823757596387, 1.9587678079234883], "isController": false}, {"data": ["Login-2", 100, 0, 0.0, 386.01, 228, 964, 274.0, 847.6, 893.9999999999995, 963.99, 1.918391620465402, 1.080837575776469, 1.3205428568688011], "isController": false}, {"data": ["View Product-6", 3480, 0, 0.0, 384.8502873563213, 195, 1628, 279.0, 822.9000000000001, 896.8999999999996, 1435.19, 2.974384396447833, 1.8043022803613706, 2.0303659112471046], "isController": false}, {"data": ["Login-3", 100, 0, 0.0, 293.17999999999984, 89, 894, 207.0, 722.4000000000001, 819.95, 893.4499999999997, 1.9189069905781668, 11.549908672020416, 1.4972721537812061], "isController": false}, {"data": ["View Product-5", 3481, 1, 0.028727377190462512, 421.0672220626262, 195, 5800, 285.0, 838.0, 913.0, 1540.079999999999, 2.974303589158189, 2.134095100334684, 1.9286499835947635], "isController": false}, {"data": ["Login-4", 100, 0, 0.0, 307.60999999999996, 79, 2874, 94.0, 701.9, 821.5999999999999, 2859.5199999999927, 1.9084697889232414, 1.0253552139394633, 1.2337958986984234], "isController": false}, {"data": ["Login-5", 100, 0, 0.0, 436.77000000000004, 193, 893, 494.5, 822.0, 843.6999999999999, 892.8199999999999, 1.8804768889390349, 0.8245450421226823, 1.0247129922148257], "isController": false}, {"data": ["Login-6", 100, 0, 0.0, 342.46, 207, 1003, 232.0, 848.6, 886.95, 1002.5099999999998, 1.880087988117844, 2.8307992782812237, 1.1089581492413845], "isController": false}, {"data": ["Login-7", 100, 0, 0.0, 564.57, 203, 5205, 514.5, 847.1, 923.7499999999995, 5204.84, 1.8605689619885761, 1.1254988650529332, 1.2700563519824362], "isController": false}, {"data": ["Open Browser-1", 100, 0, 0.0, 1638.6999999999996, 276, 7562, 983.5, 4399.2, 4509.45, 7531.939999999984, 2.2834699609526634, 14.387533217352088, 1.7795010047267827], "isController": false}, {"data": ["Open Browser-2", 100, 0, 0.0, 362.37999999999994, 80, 1309, 268.0, 701.9, 818.5999999999999, 1308.8999999999999, 2.352941176470588, 1.2326976102941176, 1.521139705882353], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 1076.09, 412, 3848, 749.0, 2352.200000000001, 2402.3999999999996, 3844.3399999999983, 3.2843958353860807, 4.992859004992281, 1.9372803560285086], "isController": true}, {"data": ["Open Browser-3", 100, 0, 0.0, 1793.6399999999999, 394, 4812, 1020.0, 4499.2, 4513.6, 4809.189999999999, 2.3025028205659552, 3.5031995795054227, 1.3581168980682001], "isController": false}, {"data": ["View Cart-1", 3476, 0, 0.0, 306.4315304948217, 80, 4407, 208.0, 713.0, 828.0, 1429.23, 2.975227550127791, 19.23051866166758, 2.2604756191400597], "isController": false}, {"data": ["View Cart", 3476, 1, 0.028768699654775604, 3055.494246260072, 104, 25422, 2983.5, 3989.3, 4373.299999999999, 5308.480000000001, 2.97508494740536, 30.425518196558027, 15.067059570705343], "isController": true}, {"data": ["View Category-2", 3499, 0, 0.0, 442.4967133466709, 200, 7994, 295.0, 851.0, 945.0, 2068.0, 2.976453775222022, 3.8562887714153256, 1.9495852973795469], "isController": false}, {"data": ["View Category-1", 3516, 0, 0.0, 381.1649601820261, 185, 5650, 267.0, 812.0, 881.0, 1435.9799999999996, 2.9822363549539816, 1.3076573116954386, 1.6250858262346892], "isController": false}, {"data": ["View Cart-8", 3471, 0, 0.0, 412.7856525496979, 196, 6206, 295.0, 845.8000000000002, 921.0, 1437.8399999999992, 2.9790846116676093, 2.1381384934788, 1.9230223909299704], "isController": false}, {"data": ["View Cart-7", 3471, 0, 0.0, 397.4753673292999, 184, 2872, 273.0, 832.0, 907.0, 1461.3999999999987, 2.977855257874887, 1.3057566010304529, 1.6197904088245236], "isController": false}, {"data": ["View Cart-6", 3472, 0, 0.0, 413.2243663594468, 205, 1715, 303.5, 847.0, 921.0, 1452.0, 2.9774793818986063, 1.7792260970879532, 2.0790017168530306], "isController": false}, {"data": ["Add to Cart", 3478, 1, 0.02875215641173088, 824.7627947096046, 201, 8596, 773.0, 1185.0, 1302.1499999999992, 1833.9400000000005, 2.9747675054119727, 2.196381289787943, 3.8775912746532364], "isController": true}, {"data": ["View Cart-5", 3473, 0, 0.0, 433.00604664555175, 195, 5806, 310.0, 845.0, 925.2999999999997, 1448.2599999999998, 2.977550486756202, 1.796779721117203, 2.0325271389087747], "isController": false}, {"data": ["View Cart-4", 3474, 0, 0.0, 339.3215313759357, 184, 3505, 251.0, 607.5, 835.0, 1184.25, 2.9772821544758648, 1.3054918787858791, 1.6223861740210277], "isController": false}, {"data": ["View Cart-3", 3475, 0, 0.0, 467.1617266187042, 183, 11917, 387.0, 842.4000000000001, 905.0, 1068.9599999999991, 2.9766723116366047, 1.305254580167139, 1.6307745769806006], "isController": false}, {"data": ["View Cart-2", 3475, 1, 0.02877697841726619, 288.5145323741009, 73, 23154, 193.0, 698.0, 712.0, 865.4799999999996, 2.9765065834329785, 1.5848191151252786, 1.920805344713724], "isController": false}, {"data": ["Login", 100, 0, 0.0, 2681.1799999999994, 1242, 6976, 2575.5, 3447.7000000000007, 4611.65, 6971.479999999998, 2.05761316872428, 20.79684284979424, 9.212802211934155], "isController": true}, {"data": ["Add to Cart-1", 3478, 0, 0.0, 397.84876365727445, 183, 3020, 282.0, 823.0, 887.0, 1424.21, 2.9747675054119727, 1.304389217387251, 1.6326360723061806], "isController": false}, {"data": ["Add to Cart-2", 3477, 1, 0.028760425654299683, 427.0365257405808, 212, 7148, 314.0, 854.2000000000003, 936.0, 1469.4199999999978, 2.9747391007509996, 0.8922400934536061, 2.2455794188286355], "isController": false}, {"data": ["View Category", 3516, 0, 0.0, 822.8671786120602, 195, 8215, 703.5, 1282.3000000000002, 1623.1499999999996, 2550.4299999999985, 2.982233825452806, 5.152752080290454, 3.569011066061653], "isController": true}, {"data": ["Register-2", 100, 0, 0.0, 392.91999999999996, 231, 1466, 264.5, 852.3000000000001, 921.6999999999999, 1460.8199999999974, 2.210921954455008, 0.6522219765642273, 1.5240679582135752], "isController": false}, {"data": ["Register", 100, 0, 0.0, 628.2699999999999, 432, 1696, 471.0, 1078.4, 1134.6499999999999, 1695.6999999999998, 2.3166917641607787, 1.6992391115487084, 2.8616573033707864], "isController": true}, {"data": ["Register-1", 100, 0, 0.0, 235.35000000000005, 187, 828, 204.0, 213.9, 588.1499999999992, 827.98, 2.3313283909171445, 1.0222328589080059, 1.2726685259010584], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 33.333333333333336, 0.0011352284079556806], "isController": false}, {"data": ["502/Bad Gateway", 2, 66.66666666666667, 0.002270456815911361], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88088, 3, "502/Bad Gateway", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Product-5", 3481, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["View Cart-2", 3475, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add to Cart-2", 3477, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
