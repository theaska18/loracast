/*
	import vendor/chart/css/ExtJSOrgChart.min.css
*/
Ext.namespace('ExtJSOrgChart');
ExtJSOrgChart.createNode = function (id,markup,parentId){
	this.parentId=parentId;
	this.id=id;
	this.markup=markup;
	this.child= new Array();
	this.getId=getId;
	function getId(){
		return this.id;
	}
	this.setId=setId;
	function setId(id){
		this.id=id;
	}
	this.getMarkup=getMarkup;
	function getMarkup(){
		return this.markup;
	}
	this.setMarkup=setMarkup;
	function setMarkup(markup){
		this.markup=markup;
	}
	this.getChildNodes=getChildNodes;
	function getChildNodes(){
		return this.child;
	}
	this.setChildNodes=setChildNodes;
	function setChildNodes(child){
		this.child=child;
	}
	this.getParentId=getParentId;
	function getParentId(){
		return this.parentId;
	}
	this.setParentId=setParentId;
	function setParentId(parentId){
		this.parentId=parentId;
	}
	this.addChild=addChild;
	function addChild(childElem){
		this.child.push(childElem);
		return this;
	}
	this.hasChildNodes=hasChildNodes;
	function hasChildNodes(){
		return this.child.length > 0;
	}
};
ExtJSOrgChart.buildNode= function (node, appendTo, level, opts) {
    var tableObj = Ext.DomHelper.append(appendTo, "<table cellpadding='0' cellspacing='0' border='0'/>");
    var tbodyObj = Ext.DomHelper.append(tableObj, "<tbody/>");
    var nodeRowHead = Ext.get(Ext.DomHelper.append(tbodyObj, "<tr />"));//.addClass("node-cells");
    var nodeCellHead = Ext.get(Ext.DomHelper.append(nodeRowHead, "<td />"));//.addClass("node-cell");
	if(opts.title != undefined && opts.title !=''){
		var nodeCTitleHead = Ext.get(Ext.DomHelper.append(nodeCellHead, "<h2 />"));
		nodeCTitleHead.dom.innerHTML=opts.title;
		opts.title='';
	}
	var nodeRow = Ext.get(Ext.DomHelper.append(tbodyObj, "<tr class='node-cells' />"));//.addClass("node-cells");
    var nodeCell = Ext.get(Ext.DomHelper.append(nodeRow, "<td colspan='2' class='node-cell' />"));//.addClass("node-cell");
    var childNodes = node.getChildNodes();
    var nodeDiv;
    if (childNodes.length > 1) {
        nodeCell.dom.setAttribute('colspan', childNodes.length * 2);
        nodeCellHead.dom.setAttribute('colspan', childNodes.length * 2);
    }
    var nodeContent=node.getMarkup();
    nodeDiv = Ext.get(Ext.DomHelper.append(nodeCell,"<div class='node'>"));//.addClass("node");
    nodeDiv.dom.innerHTML=nodeContent;
    if (childNodes.length > 0) {
        if (opts.depth == -1 || (level + 1 < opts.depth)) {
            var downLineRow = Ext.DomHelper.append(tbodyObj,"<tr/>");
            var downLineCell = Ext.DomHelper.append(downLineRow,"<td/>");
			downLineCell.setAttribute('colspan',childNodes.length * 2);
            downLine = Ext.get(Ext.DomHelper.append(downLineCell,"<div class='line down'></div>"));//.addClass("line down");
            var linesRow = Ext.DomHelper.append(tbodyObj,"<tr/>");
            Ext.each(childNodes,function (item,index) {
                var left = Ext.get(Ext.DomHelper.append(linesRow,"<td class='line left top'>&nbsp;</td>"));//.addClass("line left top");
                var right = Ext.get(Ext.DomHelper.append(linesRow,"<td class='line right top'>&nbsp;</td>"));//.addClass("line right top");
            });
            Ext.select("td:first",false,linesRow).removeCls("top");
            Ext.select("td:last",false,linesRow).removeCls("top");
            var childNodesRow = Ext.DomHelper.append(tbodyObj,"<tr/>");
            Ext.each(childNodes,function (item,index) {
                var td = Ext.DomHelper.append(childNodesRow,"<td class='node-container'/>");
				td.setAttribute('colspan',2);
				ExtJSOrgChart.buildNode(item, td, level + 1, opts);
            });

        }
    }
    Ext.each(Ext.select('a',true,nodeDiv.dom),function(item,index){
		item.onClick= function(e){
			e.stopPropagation();
		}
	});
};
ExtJSOrgChart.prepareTree= function(options){
	var appendTo = Ext.get(options.chartElement);
	var container = Ext.get(Ext.DomHelper.append(appendTo, '<div align="center" class="ExtJSOrgChart"></div>'));
	ExtJSOrgChart.buildNode(options.rootObject,container,0,options);
};
Ext.QuickTips.init();