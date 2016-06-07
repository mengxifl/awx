/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

export default
    [   '$rootScope','Wait', 'generateList', 'inventoryScriptsListObject',
        'GetBasePath' , 'SearchInit' , 'PaginateInit',
        'Rest' , 'ProcessErrors', 'Prompt', '$state', '$location',
        function(
            $rootScope,Wait, GenerateList, inventoryScriptsListObject,
            GetBasePath, SearchInit, PaginateInit,
            Rest, ProcessErrors, Prompt, $state, $location
        ) {
            var scope = $rootScope.$new(),
                defaultUrl = GetBasePath('inventory_scripts'),
                list = inventoryScriptsListObject,
                view = GenerateList;

            view.inject( list, {
                mode: 'edit',
                scope: scope
            });

            SearchInit({
                scope: scope,
                set: 'inventory_scripts',
                list: list,
                url: defaultUrl
            });

            if ($rootScope.addedItem) {
                scope.addedItem = $rootScope.addedItem;
                delete $rootScope.addedItem;
            }
            PaginateInit({
                scope: scope,
                list: list,
                url: defaultUrl
            });

            scope.search(list.iterator);

            scope.editCustomInv = function(){
                $state.transitionTo('inventoryScripts.edit',{
                    inventory_script_id: this.inventory_script.id,
                    inventory_script: this.inventory_script
                });
            };

            scope.deleteCustomInv =  function(id, name){

                var action = function () {
                    $('#prompt-modal').modal('hide');
                    Wait('start');
                    var url = defaultUrl + id + '/';
                    Rest.setUrl(url);
                    Rest.destroy()
                        .success(function () {
                            scope.search(list.iterator);
                            if (new RegExp('/' + id + '$').test($location.$$url)) {
                                $state.transitionTo($state.current.name.replace(/[.][a-zA-Z]+$/, "")); /* go to the list view */
                            }
                        })
                        .error(function (data, status) {
                            ProcessErrors(scope, data, status, null, { hdr: 'Error!',
                                msg: 'Call to ' + url + ' failed. DELETE returned status: ' + status });
                        });
                };

                var bodyHtml = '<div class="Prompt-bodyQuery">Are you sure you want to delete the inventory script below?</div><div class="Prompt-bodyTarget">' + name + '</div>';
                Prompt({
                    hdr: 'Delete',
                    body: bodyHtml,
                    action: action,
                    actionText: 'DELETE'
                });
            };

            scope.addCustomInv = function(){
                $state.transitionTo('inventoryScripts.add');
            };

        }
    ];
