function displayGallaries() {
//var directories = ["/home/gaurav/Music", "/home/gaurav/Pictures", "/home/gaurav/Videos", "/home/gaurav/Work/Document", "/home/gaurav/Work/FIRE_TRAINING_DATA/terrier-3.5_English/share/images", "/home/gaurav/Work/FIRE_TRAINING_DATA/terrier-3.5_Hindi/share/images", "/home/gaurav/Work/FIRE_TRAINING_DATA/terrier-3.5_Malyalam/share/images", "/home/gaurav/Work/HP", "/home/gaurav/Work/Haraka/Haraka/node_modules/nodeunit/img", "/home/gaurav/Work/Haraka/myApp/node_modules/expres?connect/node_modules/multiparty/test/fixture/file", "/home/gaurav/Work/Haraka/myFork/Haraka/node_modules/nodeunit/img", "/home/gaurav/Work/LocalYoutube/server"];
//print(directories);
directories  = getDirectoryData().splice(0,30);
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
    currentcl["id"] = this.nodeid;

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
        if (node.fullValue == value) {
            return node;
        }
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
                currentli["distance"] = 6+currentchilderens.length;
                data["links"][data["links"].length] = currentli;
                //             print(node.value+" ---> "+currentchilderens[child].value);
                this.printTree(currentchilderens[child]);
            }
        } else {
            //         print("Leaf node "+node.value);
        }

    };

}


var mainillusionarynode = new Node("root", "start");
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
    .attr("r", 20)
    .attr("id", function(d) { return "circle"+d.id})
    .on("dblclick",dblclick);
//.on("mouseover", expandNode);
//.style("fill", function(d) { return fill(d.type); })




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
        d3.select(this).select('text')
            .transition()
            .duration(300)
            .text(function (d) {
            var name = d.full_name.split("/");
            console.log(name);
            var second_last = name[name.length-3]? name[name.length-3]:"";    
            var second_last = name[name.length-3]? name[name.length-3]:"";    
            var shortname = "."+name[name.length-3]+"/"+name[name.length-2];
            return d.name;
        })
            .style("font-size", "15px")

        d3.select(this).select('circle')
            .transition()
            .duration(300)
            .attr("r", 50)
            .attr("class", function (d) {
                return "node type" + 2;
            });


        var current_node = mainillusionarynode.searchChildren(mainillusionarynode,d.full_name);
        while(current_node && current_node.getParentNode()) {
            var parent_= current_node.getParentNode();
            d3.select("#circle"+parent_.nodeid)
            .attr("class", function (d) {
                return "node type" + 2;
            });
            current_node = parent_;
        }
        

})


node.on("mouseout", function (d) {
    link.style('stroke-width', 2);
        d3.select(this).select('text')
            .transition()
            .duration(300)
            .text(function (d) {
            return d.name;
        })
            .style("font-size", "10px")



        d3.select(this).select('circle')
            .transition()
            .duration(300)
            .attr("r", 18)
            .attr("class", function (d) {
                return "node type" + d.type;
            });


        var current_node = mainillusionarynode.searchChildren(mainillusionarynode,d.full_name);
        while(current_node.getParentNode()) {
            var parent_= current_node.getParentNode();
            d3.select("#circle"+parent_.nodeid)
            .attr("class", function (d) {
                return "node type" + d.type;
            });
            current_node = parent_;
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
