function updateCategoriesList() {
    alert("creating list of categories")
    try{
        list = '';
        if (info.graph_groups.length > 0) {
            $('div#categories-list').html('');
            info.graph_groups.forEach(function(element, index) {
                alert("element = " + element.logo_path + ", index = " + index);
                isFileExists(element.logo_path, element, index);

            });

            

        }
    }catch(e){
        //alert(e);
    }
}

function setCategoriesList(index){
    if((index+1) == info.graph_groups.length){
        $('div#categories-list').html(list);
        //alert(list);
        showCategoriesPage();
        /*$('ul#categories-list li').bind('touchstart', function() {
                                            $(this).find('div.shadow-li').show();
                                            });

        $('ul#categories-list li').bind('touchend', function() {
                                            $(this).find('div.shadow-li').hide();
                                            });*/

        var listitems = $$('#categories-list>div');
        for (var i = 0; i < listitems.length; i++) {
            alert(i);
            listitems[i].addEventListener('click', SlideTypes, false);
        }
    }
}