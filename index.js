'use strict';


const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
};




function generateItemElement(item, itemIndex, template) {
  let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
    if (!item.checked) {
      itemTitle = `
        <form id="js-edit-item">
          <input class="shopping-item type="text" value="${item.name}" />
        </form>
      `;
    }
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

//deleting a list item.
function deleteListItem(item) {
  STORE.items.splice(item, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', function(event) {
    // get the index of the item in STORE.items
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}


//find searched items
function findSearchItem(searchItemName) {
    console.log('`findSearchItem` ran');
    //return original list if ""
    if (searchItemName === "") {
        renderShoppingList();
    } 
    else {
      const filteredSearch = STORE.items.filter(val => val.name === searchItemName) 
      const shoppingListItemsString = generateShoppingItemsString(filteredSearch);
      $('.js-shopping-list').html(shoppingListItemsString);
    }
  }
  
  // listens to item search
  function handleSearchedItemSubmit() {
      $('#search-item').keyup(function() {
          const searchWord = $('#search-item').val();
          console.log(searchWord);
          findSearchItem(searchWord);
      })
  }





// function hideCheckedItems() {
//   console.log('hide ran');
//     $('.js-shopping-item').hasClass('shopping-item__checked').hide();
//   }
  



function handleCheckBox() {
  $('input[type=checkbox]').on('change', function(event) {
  if ($('input[type=checkbox]').prop('checked')) {     
          console.log('it is checked');
          var item = $(this).closest('.container').find('.js-shopping-item');
          if(item.hasClass('shopping-item__checked')){
                 item.hide();
          }
  } else {
      renderShoppingList();
  }})
}

function editListItemName(id, itemName) {
  const item = STORE.items.find(item => item.id === id);
  item.name = itemName;
}

function handleEditShoppingItemSubmit() {
  $('.js-shopping-list').on('submit', '#js-edit-item', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemName = $(event.currentTarget).find('.shopping-item').val();
    editListItemName(id, itemName);
    renderShoppingList();
  });



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSearchedItemSubmit();
  handleCheckBox();
  handleEditShoppingItemSubmit()
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);