Ext.define('App.cmp.Table', {
	extend : 'Ext.grid.Panel',
	pageSize : 25,
	page : 0,
	total : 0,
	totalPage : 0,
	flex : 1,
	plugins: [{
		ptype: 'cellediting',
		clicksToEdit: 1
	}],
	viewConfig:{listeners:{itemkeydown:function(view,record,item,index,e){_ctrl(view.panel,e);}}},
	style:'margin-top: -1px;margin-left: -1px;margin-bottom:-1px;margin-right:-1px;',
	bodyStyle:'padding-right: -1px;',
	border : true,
	hideBbar:false,
	autoRefresh:true,
	columnLines : true,
	store : new Ext.data.ArrayStore({fields : []}),
	dataRow:null,
	getIndexSelect:function(){
		var selectedRecord = this.getSelectionModel().getSelection()[0];
		return this.store.indexOf(selectedRecord);
	},
	getDataSelect:function(){
		return this.store.data.items[this.getIndexSelect()].raw;
	},
	getDataIndex:function(idx){
		return this.store.data.items[idx].raw;
	},
	initComponent : function() {
		var $this = this;
		$this.listeners={
			cellclick : function(view, cell, cellIndex, record, row, rowIndex, e) {
				if($this.onSelect != undefined){$this.onSelect(view, cell, cellIndex, record, row, rowIndex, e);}
				$this.dataRow=record.data;
		    },
			select:function(view, record){
				if($this.onSelect != undefined){$this.onSelect(view, null, null, record, null, null, null);}
				$this.dataRow=record.data;
			},
			itemdblclick:function(view, record){
				if($this.onClick != undefined){$this.onClick(view, null, null, record, null, null, null);}
				$this.dataRow=record.data;
			}
		};
		this.bbar = new Ext.toolbar.Paging({
			store : $this.store,
			displayInfo : true,
			hidden:$this.hideBbar,
			items : [ '-', {xtype : 'displayfield',value : ''
			}, {
				xtype:'idropdown',
				data : [ {id : 1,text : 1}, {id : 5,text : 5}, {id : 10,text : 10}, {id : 25,text : 25}, {id : 50,text : 50}, {id : 100,text : 100}, {id : 200,text : 200} ],
				width : 50,
				value : $this.pageSize,
				listeners:{
					select : function(a) {
						$this.page = 0;
						$this.pageSize = a.getValue();
						$this.refresh();
					}
				}
			}],
			doRefresh : function() {$this.q.sort=undefined;$this.refresh();},
			moveFirst : function() {$this.page = 0;$this.refresh();},
			movePrevious : function() {$this.page -= 1;$this.refresh();},
			moveNext : function() {$this.page += 1;$this.refresh();},
			moveLast : function() {$this.page = $this.totalPage - 1;$this.refresh();},
			onLoad : function(a) {
				var val = parseInt($this.bbar.items.items[4].getValue());
				if (isNaN(val)){$this.page = 0;}else if(val > $this.totalPage){$this.page = $this.totalPage - 1;}
				$this.bbar.items.items[4].on('blur', function() {this.setValue($this.page + 1);});
				$this.refresh();
			}
		})
		this.q = {};
		this.q.bbar = this.bbar;
		if (this.columns != undefined) {
			var fields = [];
			for (var i = 0,iLen=this.columns.length; i < iLen; i++){
				var col=this.columns[i];
				if(col.xtype=='actioncolumn'){
					col.hideable=false;col.menuDisabled=true;col.align= 'center';col.width= 50;col.tooltip=col.text;
				}
				if(col.xtype!=='actioncolumn' && col.xtype!=='rownumberer'  && col.xtype!=='checkcolumn'&& col.renderer == undefined && col.renderer==null){
					col.renderer=function(value,meta,a,b,c,d){
						if(value != undefined && value != null){
							value=value.replace(/</g, "&lt;");
							value=value.replace(/>/g, "&gt;");
						}
						return value;
					}
				}
				if(col.flex != undefined && col.width ==undefined){col.minWidth=200;}
				if(col.xtype=='rownumberer'){col.table=$this;}
				if(col.hidden==true){col.hideable=false;}
				if (col.dataIndex != undefined){fields.push(col.dataIndex);}
			}
			this.store = new Ext.data.ArrayStore({
				fields : fields,
				sort: function(sorters) {if(sorters != undefined){$this.q.sort=sorters;$this.refresh();}}
			});
		}
		this.clear=function(){
			$this.store.loadData([], false);
		}
		this.load = function(bo) {
			var $this = this, a = $this.q.bbar.items.items, to = 0;
			Ext.Ajax.request({
				url : $this.url,
				method : 'GET',
				params:$this.param,
				success : function(response) {
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var data = $this.result(r),list = data.list,total = data.total,dataList=$this.store;
						if(list.length<dataList.getRange().length){
							var lebih=dataList.getRange().length-list.length;
							for(var i=0;i<lebih; i++){dataList.removeAt(list.length);}
						}else if(list.length>dataList.getRange().length){
							var lebih=list.length-dataList.getRange().length;
							for(var i=0;i<lebih; i++){dataList.add(list[dataList.getRange().length]);}
						}
						for(var i=0,iLen=list.length;i<iLen;i++){
							var record = dataList.getAt(i);
							var dObj=list[i];
							for(var key in dObj){record.set(key, dObj[key]);}
						}	
						$this.total = total;
						$this.totalPage = Math.ceil(total / $this.pageSize);
						if ($this.page > 0) {a[0].enable();a[1].enable();} else {a[0].disable();a[1].disable();}
						if (($this.page + 1) < $this.totalPage) {a[7].enable();a[8].enable();} else {a[7].disable();a[8].disable();}
						a[4].enable();
						a[4].setValue($this.page + 1);
						a[5].update(' of  ' + $this.totalPage);
						to = (($this.page * $this.pageSize) + $this.pageSize);
						if (to > total){to = total;}
						if(total>$this.pageSize){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to+ '/' + total);
						}else if(total > 1){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to);
						}else if(total > 0){a[15].update('1 Record');
						}else{a[15].update('No Data');}
					}
				},
				failure : function(jqXHR, exception) {$this.setLoading(false);ajaxError(jqXHR, exception,true);}
			});
		}
		this.refresh = function(bo) {
			var $this = this, a = $this.q.bbar.items.items, to = 0;
			if($this.onNotSelect != undefined){$this.onNotSelect($this);}
			$this.dataRow=null;
			var params={};
			if($this.params != undefined &&(bo== undefined || (bo != undefined && bo == true))){
				if(bo==undefined){bo=true;}
				params=$this.params(bo,$this);
			}else{params=$this.params(false,$this);$this.q.sort=undefined;}
			params['page']=$this.page*$this.pageSize;
			params['pageSize']=$this.pageSize;
			if($this.q.sort != undefined){
				params['s']=$this.q.sort.property;
				params['d']=$this.q.sort.direction;
			}
			$this.param=params;
			$this.store.loadData([], false);
			Ext.Ajax.request({
				url : $this.url,
				method : 'GET',
				params:params,
				before:function(){
					$this.setLoading('Mengambil Data');
				},
				success : function(response) {
					$this.setLoading(false);
					var r = ajaxSuccess(response);
					if (r.r == 'S') {
						var data = $this.result(r),list = data.list,total = data.total;
						$this.store.loadData([], false);
						$this.store.add(list);
						$this.total = total;
						$this.totalPage = Math.ceil(total / $this.pageSize);
						if ($this.page > 0) {a[0].enable();a[1].enable();} else {a[0].disable();a[1].disable();}
						if (($this.page + 1) < $this.totalPage) {a[7].enable();a[8].enable();} else {a[7].disable();a[8].disable();}
						a[4].enable();
						a[4].setValue($this.page + 1);
						a[5].update(' of  ' + $this.totalPage);
						to = (($this.page * $this.pageSize) + $this.pageSize);
						if (to > total){to = total;}
						if(total>$this.pageSize){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to+ '/' + total);
						}else if(total > 1){a[15].update((($this.page * $this.pageSize) + 1) + ' - ' + to);
						}else if(total > 0){a[15].update('1 Record');
						}else{a[15].update('No Data');}
						if($this.onAfterRefresh != undefined){$this.onAfterRefresh($this,list);}
					}
				},
				failure : function(jqXHR, exception){$this.setLoading(false);ajaxError(jqXHR, exception,true);}
			});
		}
		this.callParent(arguments);
		if(this.autoRefresh==true){setTimeout(function(){$this.refresh(false);},0);}
	},remove:function(index){
		this.getStore().removeAt(index);
	}
});