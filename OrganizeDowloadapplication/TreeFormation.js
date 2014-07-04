function displayGallaries() {
//var directories = ["/home/gaurav/Music", "/home/gaurav/Pictures", "/home/gaurav/Videos", "/home/gaurav/Work/Document", "/home/gaurav/Work/FIRE_TRAINING_DATA/terrier-3.5_English/share/images", "/home/gaurav/Work/FIRE_TRAINING_DATA/terrier-3.5_Hindi/share/images", "/home/gaurav/Work/FIRE_TRAINING_DATA/terrier-3.5_Malyalam/share/images", "/home/gaurav/Work/HP", "/home/gaurav/Work/Haraka/Haraka/node_modules/nodeunit/img", "/home/gaurav/Work/Haraka/myApp/node_modules/expres?connect/node_modules/multiparty/test/fixture/file", "/home/gaurav/Work/Haraka/myFork/Haraka/node_modules/nodeunit/img", "/home/gaurav/Work/LocalYoutube/server"];
//print(directories);
directories  = getDirectoryData().splice(0,12);
var currentnodenumber = 0;


var data = {};
data["nodes"] = [];
data["links"] = [];


function Node(value, fullValue) {

    this.value = value;
    this.fullValue = fullValue;
    this.nodeid = currentnodenumber;
    currentcl = {};
    currentcl["name"] = value;
    currentcl["full_name"] = fullValue;
    currentcl["type"] = 1;

    data["nodes"][data["nodes"].length] = currentcl;
    currentnodenumber++;
    this.children = [];
    this.parent = null;

    this.setParentNode = function (node) {
        this.parent = node;
    };

    this.getParentNode = function () {
        return this.parent;
    };

    this.addChild = function (node) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
    }

    this.getChildren = function () {
        return this.children;
    };

    this.removeChildren = function () {
        this.children = [];
    };

    this.searchChildren = function (node, value) {
        //  print("Searching"+value);
        var currentchilderens = node.children;
        if (currentchilderens.length > 0) {
            for (var child = 0; child < currentchilderens.length; child++) {
                if (currentchilderens[child].fullValue == value) {
                    return currentchilderens[child];
                } else {
                    var result = this.searchChildren(currentchilderens[child], value);
                    if (result !== undefined) {
                        return result;
                    }
                }
            }
        } else {
            return undefined;
        }
    };

    this.printTree = function (node) {
        //    print("Printing from "+node.fullValue+ " node id :"+node.nodeid);
        var currentchilderens = node.children;
        if (currentchilderens.length > 0) {
            for (var child = 0; child < currentchilderens.length; child++) {
                var currentli = {};
                currentli["source"] = node.nodeid;
                currentli["sourcename"] = node.value;
                currentli["target"] = currentchilderens[child].nodeid;
                currentli["targetname"] = currentchilderens[child].value;
                currentli["value"] = 1;
                currentli["distance"] = 6;
                data["links"][data["links"].length] = currentli;
                //             print(node.value+" ---> "+currentchilderens[child].value);
                this.printTree(currentchilderens[child]);
            }
        } else {
            //         print("Leaf node "+node.value);
        }

    };

}


var mainillusionarynode = new Node("root", "");
mainillusionarynode.addChild(new Node("/", "/"));
splitdirectories = [];

for (var i = 0; i < directories.length; i++) {
    var dir = directories[i].split("/");
    splitdirectories[i] = dir.splice(1, dir.length);
}
//print(splitdirectories[0][1]);
var conti = true;
var index = 0;

while (conti) {
    conti = false;
    for (var c = 0; c < splitdirectories.length; c++) {
        if (index < splitdirectories[c].length) {
            var parentpath = "/";
            for (var p = 0; p < index; p++) {
                parentpath = parentpath + splitdirectories[c][p] + "/";
            }
            var currentpath = parentpath + splitdirectories[c][index] + "/";
            var node = mainillusionarynode.searchChildren(mainillusionarynode, currentpath);
            if (node === undefined) {
                var parentnode = mainillusionarynode.searchChildren(mainillusionarynode, parentpath);
                if (parentnode !== undefined) {
                    parentnode.addChild(new Node(splitdirectories[c][index], currentpath));
                } else {
                    //   print("Something going wrong"+currentpath);
                }
            } else {
                //print("Node already there in tree"+currentpath);
            }
            conti = true;
        }
    }
    index++;
}

mainillusionarynode.printTree(mainillusionarynode);
for (i = 0; i < data["nodes"].length; i++) {
    //  print(data["nodes"][i].name);
}
for (i = 0; i < data["links"].length; i++) {
    //  print(data["links"][i].source+" ( "+data["links"][i].sourcename+" ) " + " ---->  "+data["links"][i].target+" ("+data["links"][i].targetname+" )");
}


var w = 900,
    h = 500,
    radius = d3.scale.log().domain([0, 312000]).range(["10", "50"]);

var vis = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

//vis.append("defs").append("marker")
//.attr("id", "arrowhead")
//.attr("refX", 22 + 3) /*must be smarter way to calculate shift*/
//.attr("refY", 2)
//.attr("markerWidth", 6)
//.attr("markerHeight", 4)
//.attr("orient", "auto")
//.append("path")
//.attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead

//d3.json(data, function(json) {
var force = self.force = d3.layout.force()
    .nodes(data.nodes)
    .links(data.links)
    .linkDistance(function (d) {
    return (d.distance * 10);
})
//.friction(0.5)
.charge(-250)
    .size([w, h])
    .start();



var link = vis.selectAll("line.link")
    .data(data.links)
    .enter().append("svg:line")
    .attr("class", function (d) {
    return "link" + d.value + "";
})
    .attr("x1", function (d) {
    return d.source.x;
})
    .attr("y1", function (d) {
    return d.source.y;
})
    .attr("x2", function (d) {
    return d.target.x;
})
    .attr("y2", function (d) {
    return d.target.y;
})
    .attr("marker-end", function (d) {
    if (d.value == 1) {
        return "url(#arrowhead)"
    } else {
        return " "
    };
});

function fade(opacity) {

    link.style("opacity", function (d) {
        return d.source === d || d.target === d ? 1 : opacity;
    });

}


function openLink() {
    return function (d) {
        var url = "";
        if (d.slug != "") {
            url = d.slug
        } //else if(d.type == 2) {
        //url = "clients/" + d.slug
        //} else if(d.type == 3) {
        //url = "agencies/" + d.slug
        //}
        window.open("//" + url)
    }
}




var node = vis.selectAll("g.node")
    .data(data.nodes)
    .enter().append("svg:g")
    .attr("class", "node")
    .call(force.drag);


node.append("circle")
    .attr("class", function (d) {
    return "node type" + d.type
})
    .attr("r", function (d) {
    if (d.entity == "description") {
        return 6
    } else {
        return 18
    }
})
//.on("mouseover", expandNode);
//.style("fill", function(d) { return fill(d.type); })



node.append("svg:image")
    .attr("class", function (d) {
    return "circle img_" + d.name
})
    .attr("xlink:href", function (d) {
    return d.img_hrefD
})
    .attr("x", "-36px")
    .attr("y", "-36px")
    .attr("width", "70px")
    .attr("height", "70px")
    .on("click", openLink())
    .on("mouseover", function (d) {
    if (d.entity == "company") {
        d3.select(this).attr("width", "90px")
            .attr("x", "-46px")
            .attr("y", "-36.5px")
            .attr("xlink:href", function (d) {
            return d.img_hrefL
        });
    }
})
    .on("mouseout", function (d) {
    if (d.entity == "company") {
        d3.select(this).attr("width", "70px")
            .attr("x", "-36px")
            .attr("y", "-36px")
            .attr("xlink:href", function (d) {
            return d.img_hrefD
        });
    }
});


node.append("text")
    .attr("class", function (d) {
    return "nodetext title_" + d.name
})
    .attr("dx", 0)
    .attr("dy", ".35em")
    .style("font-size", "10px")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text(function (d) {
    if (d.entity != "description") {
        return d.name
    }
});



node.on("mouseover", function (d) {
    link.style('stroke-width', function (l) {
        if (d === l.source || d === l.target) return 4;
        else return 2;
    });
    if (d.entity == "company") {
        d3.select(this).select('text')
            .transition()
            .duration(300)
            .text(function (d) {
            return d.full_name;
        })
            .style("font-size", "15px")

    } else if (d.entity == "employee") {
        var asdf = d3.select(this);
        asdf.select('text').remove();

        asdf.append("text")
            .text(function (d) {
            return d.prefix + ' ' + d.fst_name
        })
            .attr("class", "nodetext")
            .attr("dx", 0)
            .attr("dy", ".35em")
            .style("font-size", "5px")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .transition()
            .duration(300)
            .style("font-size", "12px");

        asdf.append("text").text(function (d) {
            return d.snd_name
        })
            .attr("class", "nodetext")
            .attr("transform", "translate(0, 12)")
            .attr("dx", 0)
            .attr("dy", ".35em")
            .style("font-size", "5px")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .transition()
            .duration(300)
            .style("font-size", "12px");
    } else {
        d3.select(this).select('text')
            .transition()
            .duration(300)
            .style("font-size", "15px")
    }

    if (d.entity == "company") {
        d3.select(this).select('image')
            .attr("width", "90px")
            .attr("x", "-46px")
            .attr("y", "-36.5px")
            .attr("xlink:href", function (d) {
            return d.img_hrefL
        });
    }

    if (d.entity == "company") {
        document.getElementById("add")

        d3.select(this).select('circle')
            .transition()
            .duration(300)
            .attr("r", 100)

    } else if (d.entity == "employee") {
        d3.select(this).select('circle')
            .transition()
            .duration(300)
            .attr("r", 100)
    }
})


node.on("mouseout", function (d) {
    link.style('stroke-width', 2);
    if (d.entity == "company") {
        d3.select(this).select('text')
            .transition()
            .duration(300)
            .text(function (d) {
            return d.name;
        })
            .style("font-size", "10px")
    } else if (d.entity == "employee") {
        ///////////////////////////
        // CHANGE
        ///////////////////////////

        d3.select(this).selectAll('text').remove();

        //d3.select(this).select('text')
        d3.select(this).append('text')
            .text(function (d) {
            return d.name;
        })
            .style("font-size", "14px")
            .attr("dx", 0)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .attr("class", "nodetext")
            .transition()
            .duration(300)
            .style("font-size", "10px")

    } else {
        d3.select(this).select('text')
            .transition()
            .duration(300)
            .style("font-size", "10px")
    }


    if (d.entity == "company") {
        d3.select(this).select('image')
            .attr("width", "70px")
            .attr("x", "-36px") 
            .attr("y", "-36px")
            .attr("xlink:href", function (d) {
            return d.img_hrefD
        });
    }

    if (d.entity == "company" || d.entity == "employee") {

        d3.select(this).select('circle')
            .transition()
            .duration(300)
            .attr("r", 18)
    }

});

force.on("tick", function () {
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
        return d.source.y;
    })
        .attr("x2", function (d) {
        return d.target.x;
    })
        .attr("y2", function (d) {
        return d.target.y;
    });

    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
});
}
