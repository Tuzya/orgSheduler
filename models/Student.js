const { Schema, model } = require('mongoose');

const StudentsSchema = new Schema(
  {
    name: String,
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    groupType: String,
    isArchived: {type: Boolean, default: false},
    history: [
      {
        phase: Number,
        groupType: String,
        groupName: {type: String, default: ''},
        date: Date,
        teacher: String,
        rating: String,
        comment: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// StudentsSchema.pre('save', async function(next) {
//   console.log('file-Student.js this:', this);
//   console.log('file-Student.js:', await this.populate('group'));
//   // next();
// });

module.exports = model('Student', StudentsSchema);
