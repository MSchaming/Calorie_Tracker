console.log('ready!');

/*******************
 Storage Controller
 *******************/

 const StorageCtrl = (function(){


    //Public Methods

    return {

        storeItem: function(item){
            let items;
            //check if any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //Get what is in LS and parse to object
                items = JSON.parse(localStorage.getItem('items'));

                //Push new item
                items.push(item);

                //reset ls
                localStorage.setItem('items', JSON.stringify(items));

            }
        }, //end of storeItem

        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        }, //end of get items from storage

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            //loop through items
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));

        },

        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            //loop through items
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearAllItemsStorage: function(){
            localStorage.removeItem('items');
        }


    } //end of Public methods

 })();










 /*******************
 Item Controller
 *******************/

const ItemCtrl = (function(){
   //Item Constructor
   const Item = function(id, name, calories){
    this.id = id;
    this.name= name;
    this.calories = calories;
   }
   
   //Data Structure- State

   const data = {
    //    items: [
    //     //    {id: 0, name: 'Steak Dinner', calories: 1200},
    //     //    {id: 1, name: 'Cookie', calories: 400},
    //     //    {id: 0, name: 'Eggs', calories: 300},
    //    ],
        items:  StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
   }

   //Public Methods
   return {
       getItems: function(){
           return data.items;
       },

       addItem: function(name, calories){
        //Create IDs for items
        let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id + 1;
            } else {
              ID = 0;  
            }
        //parse calories to number
         calories = parseInt(calories);

         //create new item
         newItem = new Item(ID, name, calories);

         //push new item to data.items
         data.items.push(newItem);

         return newItem;

       },


       getItemById: function(id){
        let found = null;
        //loop through items
        data.items.forEach(function(item){
            if(item.id === id) {
                found = item;
            }
        });
        return found;  
      },

      updateItem: function(name, calories){
        //turn calories to number
        calories = parseInt(calories);

        let found = null;
        data.items.forEach(function(item){
            if(item.id === data.currentItem.id){
                item.name = name;
                item.calories = calories;
                found = item;
            }
        })
        return found;
      },

      deleteItem: function(id){
        //get ids
        const ids = data.items.map(function(item){
            return item.id;
        });
        //get index from map
        const index = ids.indexOf(id);
        
        //remove item
        data.items.splice(index, 1);

      },

      clearAllItems: function(){
        data.items = [];
      },

      setCurrentItem: function(item){
        data.currentItem = item;
      },

      getCurrentItem: function(){
        return data.currentItem;
      },

       getTotalCalories: function(){
           let total = 0;
            //loop through items and add up calories
           data.items.forEach(function(item){
            total += item.calories;
           });
           //set total calories in data structure
        data.totalCalories = total;
        //return total
        return data.totalCalories;

       },



       logData: function(){
           return data;
       } //to return info in const data.  otherwise, data is private and can't be accessed.
   } //end of main ItemCtrl return
})();

















 /*******************
 UI Controller
 *******************/


const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list', //store UI id's in this object for easy reference or updating
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    //Public methods
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li> `;
            });

            //Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        }, //end of populateItemList

        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item){
            //unhide list
            document.querySelector(UISelectors.itemList).style.display ='block';
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //return node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            });
        },

        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();

        },

        removeAllItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn node list into array
            listItems = Array.from(listItems);
            //loop
            listItems.forEach(function(item){
                item.remove();
            });
        },

        hidelist: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';

        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function(){

            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        getSelectors: function(){
            return UISelectors;
        }
    } //end of return
})();

















 /*******************
 App Controller
 *******************/



const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load Event Listeners
    const loadEventListeners = function(){
        //get public UI Selectors from UICtrl
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter- disable enter key (13)
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which ===13){
                e.preventDefault();
                return false;
            }
        });

        //Edit Icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);

    } //end of loadEventListeners

    //Add item submit
    const itemAddSubmit = function(e){
        //get form input from UICtrl
        const input = UICtrl.getItemInput();

       

        //check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            //add item
           const newItem = ItemCtrl.addItem(input.name, input.calories);
           //add item to UI list
           UICtrl.addListItem(newItem);


           //get total calories from ItemCtrl method
           const totalCalories = ItemCtrl.getTotalCalories();
           //add totalCalories to UI
           UICtrl.showTotalCalories(totalCalories);

            //Store in LS
            StorageCtrl.storeItem(newItem);

           //clear input fields
           UICtrl.clearInput();
        }

        e.preventDefault();
    } //end itemAddSubmit


    //Click Edit Item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
         //break id into array
         const listIdArray = listId.split('-');
         console.log(listIdArray); // ["item", "0"]

        //get the acutal id
        const id = parseInt(listIdArray[1]); //gets id # which is in the [1] index
        console.log(id);

        //get item
        const itemToEdit = ItemCtrl.getItemById(id);

        //set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        //Add item to form
        UICtrl.addItemToForm();
        } //end of if()

        e.preventDefault();
    }

    //Update Item Submit
    const itemUpdateSubmit = function(e){
        //Get Item Input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories from ItemCtrl method
        const totalCalories = ItemCtrl.getTotalCalories();
        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update ls
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    } //end of Update Item Submit


    //Delete Button event
    const itemDeleteSubmit = function(e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);


        //delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories from ItemCtrl method
        const totalCalories = ItemCtrl.getTotalCalories();
        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }


    //clear items event
    const clearAllItems = function(){
        //clear all items from data structure
        ItemCtrl.clearAllItems();

        //update calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add totalCalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //remove from UI
        UICtrl.removeAllItems();

        //clear all items from storage

        StorageCtrl.clearAllItemsStorage();

        //hide the UL
        UICtrl.hidelist();

    }



    //Public methods
    return {
        init: function(){
            console.log("Initializing App..");

            //hide edit buttons on load/clear Edit State
            UICtrl.clearEditState();

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //call hideList
            if(items.length === 0){
                UICtrl.hidelist();
            } else {
            //populate list with items
            UICtrl.populateItemList(items);
            }

           //get total calories from ItemCtrl method
           const totalCalories = ItemCtrl.getTotalCalories();
           //add totalCalories to UI
           UICtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListeners();
            

        }
    } //end of public return methods
    
})(ItemCtrl, StorageCtrl, UICtrl);


//Initialize App

App.init(); //runs this function first, our initializer runs anything we want run as soon as app loads