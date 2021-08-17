//itextarea
Ext.define('ITextArea', {
	alias:'widget.itextarea',
	extend:'Ext.form.TextArea',
	property:{},
	press:{},
	event:{},
	editorFlag:false,
	enableKeyEvents:true,
	margin:true,
	//height:47,
	// style:'47px',
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event;
		property.type='textfield';
		if(this.listeners==undefined){this.listeners=[];}
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
		};
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(event.focus != undefined){event.focus(textfield,e);}
		};
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			_ctrl(textfield,e);
			if(e.keyCode==13){
				e.preventDefault();		
			}
			return false;
		};
		this.listeners.keydown=keydown;
		//keyup
		var keyupOri=null;
		if(this.listeners.keyup!=undefined){keyupOri=this.listeners.keyup;}
		var keyup=function(textfield,e){
			if(keyupOri != null){keyupOri(textfield,e);}
			_ctrl(textfield,e);
			if(e.keyCode==13){
				nextFocus(textfield,e);			
			}
			return false;
		};
		this.listeners.keyup=keyup;
		//specialkey
		var specialkeyOri=null;
		if(this.listeners.specialkey!=undefined){specialkeyOri=this.listeners.specialkey;}
		var specialkey=function(textfield,e){
			if(specialkeyOri != null){specialkeyOri(textfield,e);}
			if (this.property.tab != undefined && this.property.tab==true && e.getKey() == e.TAB) {
				e.stopEvent();
				var el = textfield.inputEl.dom;
				if (el.setSelectionRange) {
					var withIns = el.value.substring(0, el.selectionStart) + '\t',pos = withIns.length;
					el.value = withIns + el.value.substring(el.selectionEnd, el.value.length);
					el.setSelectionRange(pos, pos);
				}else if (document.selection) {document.selection.createRange().text = '\t';}
			}
			return false;
		};
		this.listeners.specialkey=specialkey;
		if(this.maxLength==undefined){this.maxLength=128;}
		var allowBlank='';
		
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';		
		}
		if(this.note != undefined && this.note !=''){
			this.on({
				afterrender:this.calculate,
				scope:this
			});
		}
		this.callParent(arguments);
	},
	toEditor:function(){
		var $this=this;
		if($this.editorFlag==false){
			importComponent(['vendor/codemirror/codemirror.js','vendor/codemirror/codemirror.css','vendor/codemirror/mode/xml/xml.js',
			'vendor/codemirror/mode/htmlmixed/htmlmixed.js','vendor/codemirror/mode/javascript/javascript.js','vendor/codemirror/mode/css/css.js',
			'vendor/codemirror/mode/php/php.js'],function(para,param2){
				$this.codemirror = CodeMirror.fromTextArea(document.getElementById($this.id+"-inputEl"), {
						lineNumbers: true,
						parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js",
                     "../contrib/php/js/tokenizephp.js", "../contrib/php/js/parsephp.js",
                     "../contrib/php/js/parsephphtmlmixed.js"],
        stylesheet: ["../../css/xmlcolors.css", "../../css/jscolors.css", "../../css/csscolors.css", "css/phpcolors.css"],
        path: "../../js/",
        continuousScanning: 500
				});
				$this.editorFlag=true;
			});
		}
	},
	calculate:function(textfield,e){
		var me=this,
			span=Ext.dom.Query.select('textarea',me.getEl().dom)[0];
		var newEl=document.createElement('td');
		newEl.innerHTML='&nbsp;<span class="fa fa-info-circle" title="'+me.note+'"></span>';
		newEl.style.width='20px';
		if(me.labelAlign=='top'){
			newEl.style['padding-top']='13px';
		}
		newEl.setAttribute('valign','top');
		span.parentNode.parentNode.append(newEl);
	},
});