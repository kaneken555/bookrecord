function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-tag-button').addEventListener('click', function() {
        var tagList = document.getElementById('tag-list');
        var newTag = document.createElement('div');
        newTag.className = 'input-group mb-3';
        newTag.innerHTML = `
            <input type="text" name="tags" class="form-control" placeholder="Tag">
            <div class="input-group-append">
                <button class="btn btn-outline-danger remove-tag-button" type="button"><i class="fas fa-minus"></i></button>
            </div>
        `;
        tagList.appendChild(newTag);
        
        var removeButtons = document.querySelectorAll('.remove-tag-button');
        removeButtons[removeButtons.length - 1].addEventListener('click', function() {
            this.closest('.input-group').remove();
        });
    });
});

