Ext.define('App.cmp.HtmlEditor',{
	extend : 'Ext.Panel',
	property:{type:'htmleditor',param:0},
	layout:'fit',
	border:false,
	initComponent:function(){
		var $this=this;
		var file=new Ext.form.field.File({
			type : 'filefield',
			hidden:true,
			result:null,
			listeners:{
				change:function(a){
					var file = a.getEl().down('input[type=file]').dom.files[0];
					var reader = new FileReader();
					reader.onload = (function(theFile) {return function(e) {$this.result=btoa(e.target.result);windowFoto.show();style.setValue('');style.focus();};})(file);
					reader.readAsBinaryString(file);
				}
			}
		});
		this.items=[
			{
				xtype: 'tinymce_textarea',
				fieldStyle: 'font-family: Courier New; font-size: 12px;',
				style: { border: '0' },
				id: $this.id+'.htmlEditor',
				height: 'auto',
				id_duplikat:'dawdw',
				openFile:function(){},
				settings:{image_list:'string',id_duplikat:'dawdw',},
				tinyMCEConfig:{
					plugins: [
					"advlist autolink lists link image charmap print preview hr anchor pagebreak","searchreplace wordcount visualblocks visualchars code fullscreen",
					"insertdatetime media nonbreaking save table contextmenu directionality","emoticons template paste textcolor"
					],
					toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor | table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
					content_css : "vendor/tinymce/contents.css",
					relative_urls : false,
					remove_script_host : false,
					document_base_url : url,
					menubar: false,
					templates: [{title: 'Box Code', description: 'Untuk Script HTML', content: "<div style='background-color: #F4F5F7;border: 1px dashed #CCC; padding: 10px; t-align: left;'>&nbsp;</div><br>"},],
					nonbreaking_force_tab:true,
					toolbar_items_size: 'small'
				}
			}
		];
		$this.setValue=function(val){Ext.getCmp($this.id+'.htmlEditor').setValue(val);}
		$this.getValue=function(){return Ext.getCmp($this.id+'.htmlEditor').getValue();}
		this.callParent(arguments);	
	}
});