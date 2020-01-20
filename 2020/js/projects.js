totalwidth = 12;
data = 
[
    {
        "name": "Friend Wagon",
        "link": "https://github.com/alanplotko/FriendWagon",
        "descr":""
    },
    {
        "name": "Cinemini",
        "link": "https://github.com/gabeochoa/cinemini",
        "descr":""
    },
    {
        "name": "Deciet",
        "link": "https://github.com/gabeochoa/Sokim",
        "descr":""
    },
    {
        "name": "History Genie",
        "link": "https://github.com/gabeochoa/HistoryGenie",
        "descr":""
    },
];
rowswanted = 2;


//called as:
//main(rowswanted, data);

//========== CODE BELOW =========
/* FORMAT
<div id="portcontainer" class="container">
    <div class="row">
        //project
    </div>
</div>
//for each project
<div class="$$$$$ pillars">
    <div class="card bg-car">
        <div class="body">
            <div class="content">
                <h2>Project 1</h2>
                <p>Description</p>
            </div>
        </div>
    </div>
</div>
*/

numname = function(number)
{
    switch(number)
    {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        case 6:
            return "six";
        case 7:
            return "seven";
        case 8:
            return "eight";
        case 9:
            return "nine";
        case 10:
            return "ten";
        case 11:
            return "eleven";
        case 12:
            return "twelve";
    }
}
createRow = function(parent)
{
    var contt = $(document.createElement('div')).attr("class", "container");
    var roww = $(document.createElement('div')).attr("class", "row");
    roww.appendTo(contt);
    contt.appendTo(parent);
    return [contt, roww];
}

main = function(rows, data)
{

    var parent = $("#portcontainer");
    console.log("main" + rowswanted + " " + data);
    var oneachrow = Math.ceil(data.length/(rowswanted*1.0));
    var avgwidth = Math.floor(totalwidth / oneachrow);
    console.log(avgwidth);
    j = 0;
    var eh = createRow(parent);
    var cont = eh[0];
    var divrow = eh[1];

    for(i in data)
    { //for each project
        //create div .<avgwidth> pillars
        var divavg = $(document.createElement('div')).attr("class", numname(avgwidth) + " pillars");
        //create div .card bg-<projectname>
        var divcard = $(document.createElement('div')).attr("class", "card");
        divcard.css("background", "url(img/portfolio/"+data[i]["name"].toLowerCase().replace(/\s+/g, '')+".jpg)");
        divcard.css("background-size", "cover");
        divcard.css("background-position", "center");
        //create div .body
        var divbody = $(document.createElement('div')).attr("class", "body");
        //create div .content
        var divcont = $(document.createElement('div')).attr("class", "content");
        //create h2 <name>
        var h2name =  $(document.createElement('h2'));
        if(data[i]["name"] != "Friend Wagon")
             h2name.text(data[i]["name"]);
        //create p <decrp>
        var pdec = $(document.createElement('p')).text(data[i]["descr"]);
        //create a <link>
        var alink = $(document.createElement('a')).attr("href", data[i]["link"]);
        
        h2name.appendTo(divcont);
        pdec.appendTo(divcont);
        divcont.appendTo(divbody);
        divcont.appendTo(divcard);
        alink.appendTo(divavg);
        divcard.appendTo(alink);
        divavg.appendTo(divrow);  
        if(j == oneachrow)
        {
            j = 0; 
            if(i+1 < data.length)
            {
                eh = createRow(parent);
                cont = eh[0];
                divrow = eh[1]
            }
        }
        j++;
    }
    //finally append to master
    //parent.appendTo($("portcontainer"));
    console.log(parent);
}
main(rowswanted, data);







