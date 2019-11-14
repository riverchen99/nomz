
const MenuItem = require('../models/MenuItem');
const Menu = require('../models/Menu');

const Restaurant = require('../models/Restaurant');
/*

IN PROGRESS FOR USER FILTERS
HAVEN'T BEEN IMPLEMENTED FOR
DB POPULATION SO COMMENTING THIS OUT
const Review = require('../models/Review');
const User = require('../models/User');
*/
/* function preferenceMatchScore(userInfo, menuItem){

} */
/*
function propsCheck(infoArray, props, type){
  var matchScore = 0;
  const maxScore = infoArray.length;
  if (maxScore == 0){
    //no restrictions/preferences to worry about so we can include it
    return true;
  }
  for (var i = 0; i < inforArray.length; i+=1){
    switch(infoArray[i]){
      case('vegetarian'):
      {
        if (props.vegetarian){
          matchScore+=1;
        }
        break;
      }
      case('vegan'):
      {
        if (props.vegan){
          matchScore+=1;
        }
        break;
      }
      case('peanuts'):
      {
        if (props.peanuts){
          matchScore+=1;
        }
        break;
      }
      case('treeNuts'):
      {
        if (props.treeNuts){
          matchScore+=1;
        }
        break;
      }
      case('wheat'):
      {
        if (props.wheat){
          matchScore+=1;
        }
        break;
      }
      case('gluten'):
      {
        if (props.gluten){
          matchScore+=1;
        }
        break;
      }return true;
      case('soy'):
      {
        if (props.soy){
          matchScore+=1;
        }
        break;
      }
      case('dairy'):
      {
        if (props.dairy){
          matchScore+=1;
        }
        break;
      }
      case('eggs'):
      {
        if (props.eggs){
          matchScore+=1;
        }
        break;
      }
      case('shellfish'):
      {
        if (props.shellfish){
          matchScore+=1;
        }
        break;
      }
      case('fish'):
      {
        if (props.fish){
          matchScore+=1;
        }
        break;
      }
      case('halal'):
      {
        if (props.halal){
          matchScore+=1;
        }
        break;
      }
      case('lowCarbon'):
      {
        if (props.lowCarbon){
          matchScore+=1;
        }
        break;
      }
    }
  }
  if (type == 'restrictions'){
    if (matchScore == 0){
      //contains no "bad" stuff, include in filtered results
      return true;
    } else {
      //contains incompatible stuff, exclude from filtered results
      return false;
    }
  } else if (type == 'preferences'){
    //80% matching threshold for acceptance of match
    if ((matchScore/maxScore) >= 0.5){
      return true;
    } else {
      return false;
    }
  }
}

//Used by both ingredients and allergens
function restrictionCheck(restrictions, info){
  //var infoArray = info.split(", ");
  if (restrictions.length == 0 || info.length == 0){
    //no restrictions, good to go
    return true;
  }

  for (var i = 0; i < restrictions.length; i+=1){
    if (infoArray.includes(restrictions[i])){
      //Exclude from filtered results
      return false;
    }
  }
  //Include in filtered results
  return true;
}

function itemCompatibilty(preferences, restrictions, menuItem){
  var prefProps = (propsCheck(preferences, menuItem.props, "preferences"));
  var restrictProps = (propsCheck(restrictions, menuItem.props, "restrictions"));
  var ingredientCheck = restrictionCheck(restrictions, menuItem.ingredients);
  var allergenCheck = restrictionCheck(restrictions, menuItem.allergens);
  return prefProps && restrictProps && ingredientCheck && allergenCheck;
}
*/

async function generateRecommendations(
  availableMenuItemIds,
  filterRestaurant,
  filterPreferences,
  filterRestrictions,
) {
  // look up menuItem by menuItemIds

  // console.log(availableMenuItemIds);
  if (filterRestaurant) {
    // placeholder
    const rest = 'Bruin Plate';
    Restaurant.find().where('name').equals(rest)
      .then((restId) => {
        console.log(((restId[0]).id));
        const restaurant = (restId[0]).id; // eslint-disable-line
      });
  }

  const results = await MenuItem.find({ _id: { $in: availableMenuItemIds } });


  // refactor this
  for (let i = 0; i < results.length; i += 1) {
    if (filterRestaurant) {
      console.log(results[i].restaurant);
      // if ((results[i]).restaurant != restaurant){
      // remove this menuItem
      // }
    }
    if (filterRestrictions) {
      console.log(results[i].props);
      // parse ingredients for allergens
      // parse props
    }
    if (filterPreferences) {
      console.log(results[i].preferences);
      // array.filter()
      // find counterpart
      // sort both
    }
  }


  results.sort((a, b) => b.rating - a.rating);
  console.log(results);


  return results;
}

async function recommendationController(req, res) {
  // call this with
  // GET /recommendations?startTime=YYYY-MM-DDTHH:MM:SSZ&userId=whatever

  const date = new Date(req.query.startTime);
  // console.log(date);
  // const userId = req.query.userId // to fix lint error

  // const oldDate = new Date('Tue Nov 12 2019 11:30:00 AM');
  // console.log(oldDate)

  // Menu.find().then(() => console.log(results));


  const availableMenus = await Menu.find({ endTime: { $gte: date }, startTime: { $lte: date } });

  // availableMenus is an array of Menus available today
  console.log(availableMenus);
  let menuItemIds = [];
  for (let i = 0; i < availableMenus.length; i += 1) {
    menuItemIds = menuItemIds.concat((availableMenus[i]).menuItems);
  }
  // console.log(menuItemIds);
  // For now, user filters are false to only generate general recommendations

  const recommendations = await generateRecommendations(menuItemIds, false, false, false);
  res.json(recommendations);
}


module.exports = { recommendationController };
