---
title: "Advanced Topics"
pre: "7. "
weight: 70
---

This set of milestones is all about building a RESTful API and interface for the [Lost Kansas Communities](https://lostkansas.ccrsdigitalprojects.com/) project. 

## Milestone 7 - Advanced Topics

Building from the [previous milestone](../06-vue-crud-app/), expand upon the starter project by adding the following features:

1. **Metadata List View** - add a view to show all metadata available in the application. You **MAY NOT** use the [PrimeVue DataTable](https://primevue.org/datatable/) component for this. Instead, develop your own method to display these items (for example, consider using the [PrimeVue DataView](https://primevue.org/dataview/) along with your own custom component for showing each individual metadata item).
2. **Metadata Single View** - each metadata item in the Metadata List View should be clickable and direct users to a page showing all data about that metadata item, including all linked communities and documents. 
3. **Edit Metadata View** - for users with the appropriate roles, display buttons to edit and delete metadata items. Users should be able to edit all items of a metadata item except `owner_user_id` (this should be set on the backend to the currently authenticated user) and `copyright_id` (this can be set to a default value of "1"). 
4. **Manage Documents & Communities** - for users with the appropriate roles, include methods for adding and removing documents and communities from a metadata item. 

For 10% extra credit each, implement the following features:

1. Enable filtering of the Metadata List View by keyword. For this project, we will assume that each individual word (delimited by spaces) in the `keywords` attribute of a metadata item is a valid keyword. 
2. Add a map view on the Metadata Single View that shows a map with the coordinates of the first community attached to the metadata item, if one is present. Your application should seamlessly handle situations where a metadata item does not have a community attached (in that case, the map can be hidden). 

### Hints

1. Filtering by keywords is easier than it may seem - at a minimum, you can create a route that includes a tag as a route parameter (e.g. `metadata/tags/<tag>`) and then use a computed value to filter the list of metadata using that keyword. You'll also need to use `split()` and `trim()` effectively on the `keyword` attribute. 
2. For creating a map, consider using the [vue3-openlayers](https://vue3openlayers.netlify.app/) library.
